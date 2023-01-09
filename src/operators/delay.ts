import { AnyGenerator, UnaryOperator } from '../index';
import { operator } from './index';

declare global {
    interface Observable<T> {
        delay(due: number): Observable<T>;
    }
}

export function delay<T>(due: number): UnaryOperator<T> {
  return operator(async function* (generator: AnyGenerator<T>) {
    await new Promise((resolve) => setTimeout(resolve, due));
    yield* generator;
  });
}
