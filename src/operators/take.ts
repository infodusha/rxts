import { AnyGenerator, UnaryOperator } from '../index';
import { Subscription } from '../subscription';
import { operator } from './index';

declare global {
    interface Observable<T> {
        take(count: number): Observable<T>;
    }
}

export function take<T>(count: number): UnaryOperator<T> {
  return operator(async function* (generator: AnyGenerator<T>, sub?: Subscription) {
    let i = count;
    for await (const value of generator) {
      if (sub?.isCancelled) return;
      if (i-- <= 0) {
        return;
      }
      yield value;
      if (i <= 0) {
        return;
      }
      if (sub?.isCancelled) return;
    }
  });
}
