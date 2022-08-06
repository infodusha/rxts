import { AnyGenerator, Observable, StartOperator } from './index';
import { Subscription } from './subscription';

export type ObservableInput<T> = Observable<T> | Iterable<T> | AsyncIterable<T> | Promise<T>;

export async function firstValueFrom<T>(observable: Observable<T>): Promise<T> {
  const generator: AnyGenerator<T> = generatorFrom(observable);
  const { value } = await generator.next();
  return value;
}

export async function lastValueFrom<T>(observable: Observable<T>): Promise<T> {
  const empty: unique symbol = Symbol('empty');
  const generator: AnyGenerator<T> = generatorFrom(observable);
  let lastValue: T | typeof empty = empty;
  for await (const value of generator) {
    lastValue = value;
  }
  if (lastValue === empty) {
    throw new Error('EmptyError');
  }
  return lastValue;
}

export function generatorFrom<T>(stream: Observable<T>): AnyGenerator<T> {
  return stream._startOperator();
}

export function from<T>(data: ObservableInput<T>): Observable<T> {
  if (data instanceof Observable) {
    return data;
  }
  return new Observable<T>(() => async function* () {
    if (data instanceof Promise) {
      yield await data;
      return;
    }
    for await (const item of data) {
      yield item;
    }
  });
}

export function of<T>(data: T): Observable<T> {
  return new Observable<T>(() => function* () {
    yield data;
  });
}

export function defer<T>(observableFactory: () => ObservableInput<T>): Observable<T> {
  return new Observable<T>(() => async function* () {
    yield* await generatorFrom(from(observableFactory()));
  });
}

export function interval(period = 0): Observable<number> {
  return new Observable<number>(() => async function* () {
    let i = 0;
    while (true) {
      await new Promise((resolve) => setTimeout(resolve, period));
      yield i++;
    }
  });
}

export function itemOperator<T, R>(operator: (item: T) => AnyGenerator<R>): (startOperator: StartOperator<T>) => StartOperator<R> {
  return (startOperator) => async function* (sub?: Subscription) {
    if (sub?.isCancelled) return;
    const generator = startOperator(sub);
    for await (const value of generator) {
      if (sub?.isCancelled) return;
      yield* operator(value);
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
