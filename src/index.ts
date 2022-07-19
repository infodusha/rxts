import { Subscription } from './subscription';

export type AnyGenerator<T> = Generator<T> | AsyncGenerator<T>;
export type StartOperator<T> = (sub?: Subscription) => AnyGenerator<T>;
export type Operator<T, R> = (startOperator: StartOperator<T>) => StartOperator<R>;
export type UnaryOperator<T> = Operator<T, T>;

export interface Subscribe<T> {
    next?(value: T): void;
    error?(err: unknown): void;
    complete?(): void;
}

export class Observable<T> {
  public readonly _startOperator: StartOperator<T>;

  constructor(init: () => StartOperator<T>) {
    this._startOperator = init();
  }

  pipe(): Observable<T>;
  pipe<A>(op1: Operator<T, A>): Observable<A>;
  pipe<A, B>(op1: Operator<T, A>, op2: Operator<A, B>): Observable<B>;
  pipe<A, B, C>(op1: Operator<T, A>, op2: Operator<A, B>, op3: Operator<B, C>): Observable<C>;
  pipe<A, B, C, D>(
        op1: Operator<T, A>,
        op2: Operator<A, B>,
        op3: Operator<B, C>,
        op4: Operator<C, D>
    ): Observable<D>;

  pipe<A, B, C, D, E>(
        op1: Operator<T, A>,
        op2: Operator<A, B>,
        op3: Operator<B, C>,
        op4: Operator<C, D>,
        op5: Operator<D, E>
    ): Observable<E>;

  pipe<A, B, C, D, E, F>(
        op1: Operator<T, A>,
        op2: Operator<A, B>,
        op3: Operator<B, C>,
        op4: Operator<C, D>,
        op5: Operator<D, E>,
        op6: Operator<E, F>
    ): Observable<F>;

  pipe<A, B, C, D, E, F, G>(
        op1: Operator<T, A>,
        op2: Operator<A, B>,
        op3: Operator<B, C>,
        op4: Operator<C, D>,
        op5: Operator<D, E>,
        op6: Operator<E, F>,
        op7: Operator<F, G>
    ): Observable<G>;

  pipe<A, B, C, D, E, F, G, H>(
        op1: Operator<T, A>,
        op2: Operator<A, B>,
        op3: Operator<B, C>,
        op4: Operator<C, D>,
        op5: Operator<D, E>,
        op6: Operator<E, F>,
        op7: Operator<F, G>,
        op8: Operator<G, H>
    ): Observable<H>;

  pipe<A, B, C, D, E, F, G, H, I>(
        op1: Operator<T, A>,
        op2: Operator<A, B>,
        op3: Operator<B, C>,
        op4: Operator<C, D>,
        op5: Operator<D, E>,
        op6: Operator<E, F>,
        op7: Operator<F, G>,
        op8: Operator<G, H>,
        op9: Operator<H, I>
    ): Observable<I>;

  pipe<A, B, C, D, E, F, G, H, I>(
        op1: Operator<T, A>,
        op2: Operator<A, B>,
        op3: Operator<B, C>,
        op4: Operator<C, D>,
        op5: Operator<D, E>,
        op6: Operator<E, F>,
        op7: Operator<F, G>,
        op8: Operator<G, H>,
        op9: Operator<H, I>,
        ...operations: Operator<any, any>[]
    ): Observable<unknown>;

  pipe(...operators: Operator<T, any>[]): Observable<unknown> {
    let startOperator = this._startOperator.bind(this);
    for (const operator of operators) {
      startOperator = operator(startOperator);
    }
    return new Observable<unknown>(() => startOperator);
  }

  subscribe(subscribe?: Subscribe<T>): Subscription {
    const sub: Subscription = new Subscription();

    const run = async () => {
      if (sub?.isCancelled) return;
      for await (const value of this._startOperator(sub)) {
        if (sub.isCancelled) return;
        subscribe?.next?.(value);
        if (sub?.isCancelled) return;
      }
      if (sub.isCancelled) return;
      subscribe?.complete?.();
    };

    run().catch(subscribe?.error);

    return sub;
  }
}
