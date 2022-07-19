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
