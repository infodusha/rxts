import { AnyGenerator, UnaryOperator } from '../index';
import { operator } from '../helpers';

declare global {
    interface Observable<T> {
        distinctUntilChanged(comparator?: (previous: T, current: T) => boolean): Observable<T>;
    }
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
