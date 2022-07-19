import { Operator, Observable, UnaryOperator, AnyGenerator } from './index';
import { generatorFrom, itemOperator, operator } from './helpers';

// TODO That may be works as mergeMap, i am not sure about that
export function switchMap<T, R>(callback: (value: T) => Observable<R>): Operator<T, R> {
  return itemOperator(async function* (value: T) {
    yield* generatorFrom(callback(value));
  });
}

export function map<T, R>(callback: (value: T) => R): Operator<T, R> {
  return itemOperator(function* (value) {
    yield callback(value);
  });
}

export function tap<T>(callback: (value: T) => void): UnaryOperator<T> {
  return itemOperator(function* (value: T) {
    callback(value);
    yield value;
  });
}

export function filter<T>(callback: (value: T) => boolean): UnaryOperator<T> {
  return itemOperator(function* (value: T) {
    if (callback(value)) {
      yield value;
    }
  });
}

export function delay<T>(due: number): UnaryOperator<T> {
  return operator(async function* (generator: AnyGenerator<T>) {
    await new Promise((resolve) => setTimeout(resolve, due));
    yield* generator;
  });
}

export function take<T>(count: number): UnaryOperator<T> {
  return operator(async function* (generator: AnyGenerator<T>) {
    let i = count;
    for await (const value of generator) {
      if (i-- <= 0) {
        return;
      }
      yield value;
      if (i <= 0) {
        return;
      }
    }
  });
}

export function distinctUntilChanged<T>(comparator?: (previous: T, current: T) => boolean): UnaryOperator<T> {
  const NO_VALUE: unique symbol = Symbol('NO_VALUE');
  return operator(async function* (generator: AnyGenerator<T>) {
    let previous: T | typeof NO_VALUE = NO_VALUE;
    for await (const value of generator) {
      if (previous === NO_VALUE || !(comparator ? comparator(previous, value) : previous === value)) {
        previous = value;
        yield value;
      }
    }
  });
}

// TODO finish later
// export function takeUntil<T>(observable$: Observable<unknown>): UnaryOperator<T> {
//     return operator(async function* (generator: AnyGenerator<T>, sub?: Subscription) {
//         const intSub: Subscription = observable$.pipe(take(1)).subscribe(() => {
//             sub?.unsubscribe();
//             intSub.unsubscribe();
//         });
//         sub.onCancel(() => intSub.unsubscribe());
//         yield* generator;
//     })
// }
