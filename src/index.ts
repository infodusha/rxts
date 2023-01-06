import { Subscription } from './subscription';
import { isAsync } from './internal';

export type AnyGenerator<T> = Generator<T> | AsyncGenerator<T>;
export type StartOperator<T> = (sub?: Subscription) => AnyGenerator<T>;
export type Operator<T, R> = (startOperator: StartOperator<T>) => StartOperator<R>;
export type UnaryOperator<T> = Operator<T, T>;

export interface Subscribe<T> {
    next?(value: T): void;
    error?(err: unknown): void;
    complete?(): void;
}

declare global {
  interface Observable<T> {
    readonly _startOperator: StartOperator<T>
    subscribe(subscribe?: Subscribe<T>): Subscription
  }
}

class _Observable<T> {
  public readonly _startOperator: StartOperator<T>;

  constructor(init: () => StartOperator<T>) {
    this._startOperator = init();
  }

  subscribe(subscribe?: Subscribe<T>): Subscription {
    const sub: Subscription = new Subscription();

    const generator = this._startOperator(sub);

    function checkComplete(): boolean {
      if (sub.isCancelled) {
        subscribe?.complete?.();
      }
      return sub.isCancelled;
    }

    if (isAsync(generator)) {
      async function run(): Promise<void> {
        if (checkComplete()) return;
        for await (const value of generator) {
          if (checkComplete()) return;
          subscribe?.next?.(value);
          if (checkComplete()) return;
        }
        subscribe?.complete?.();
      }

      run().catch(subscribe?.error);
    } else {
      try {
        for (const value of generator) {
          subscribe?.next?.(value);
          if (sub.isCancelled) break;
        }
        subscribe?.complete?.();
      } catch (e) {
        subscribe?.error?.(e);
      }
    }

    return sub;
  }
}

// eslint-disable-next-line no-undef,no-use-before-define
export const Observable = _Observable as unknown as { new <T>(init: () => StartOperator<T>): Observable<T> };

export { registerOperator } from './operators/index';
