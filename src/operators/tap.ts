import { itemOperator } from '../helpers';
import { UnaryOperator } from '../index';

declare global {
    interface Observable<T> {
        tap(callback: (value: T) => void): Observable<T>;
    }
}

export function tap<T>(callback: (value: T) => void): UnaryOperator<T> {
  return itemOperator(function* (value: T) {
    callback(value);
    yield value;
  });
}
