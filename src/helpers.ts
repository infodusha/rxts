import { AnyGenerator, Observable, StartOperator } from './index';
import { Subscription } from './subscription';

export async function firstValueFrom<T>(observable: Observable<T>): Promise<T> {
  const generator: AnyGenerator<T> = observable._startOperator();
  const { value } = await generator.next();
  return value;
}

export function generatorFrom<T>(stream: Observable<T>): AnyGenerator<T> {
  return stream._startOperator();
}

export function from<T>(data: Iterable<T>): Observable<T> {
  return new Observable<T>(() => function* () {
    for (const item of data) {
      yield item;
    }
  });
}

export function of<T>(data: T): Observable<T> {
  return new Observable<T>(() => function* () {
    yield data;
  });
}

export function itemOperator<T, R>(operator: (item: T) => AnyGenerator<R>): (startOperator: StartOperator<T>) => StartOperator<R> {
  return (startOperator) => async function* (sub?: Subscription) {
    if (sub?.isCancelled) return;
    const generator = startOperator(sub);
    for await (const value of generator) {
      if (sub?.isCancelled) return;
      yield * operator(value);
    }
  };
}

export function operator<T, R>(operator: (generator: AnyGenerator<T>, sub?: Subscription) => AnyGenerator<R>): (startOperator: StartOperator<T>) => StartOperator<R> {
  return (startOperator) => async function* (sub?: Subscription) {
    if (sub?.isCancelled) return;
    const generator = startOperator(sub);
    for await (const value of operator(generator, sub)) {
      if (sub?.isCancelled) return;
      yield value;
    }
  };
}

function* noop() {
  // NOOP
}

export const EMPTY: Observable<never> = new Observable(() => noop);
