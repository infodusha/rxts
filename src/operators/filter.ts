import { UnaryOperator } from '../index';
import { itemOperator } from '../helpers';

declare global {
  interface Observable<T> {
    filter(callback: (value: T) => boolean): Observable<T>;
  }
}

export function filter<T>(callback: (value: T) => boolean): UnaryOperator<T> {
  return itemOperator(function* (value: T) {
    if (callback(value)) {
      yield value;
    }
  });
}
