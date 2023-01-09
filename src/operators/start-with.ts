import { AnyGenerator, Operator } from '../index';
import { operator } from './index';

declare global {
    interface Observable<T> {
        startWith<D>(...values: D[]): Observable<T | D>;
    }
}

export function startWith<T, D>(...values: D[]): Operator<T, T | D> {
  return operator(async function* (generator: AnyGenerator<T>) {
    for (const value of values) {
      yield value;
    }
    yield* generator;
  });
}
