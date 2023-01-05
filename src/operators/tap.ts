import { itemOperator } from '../helpers';

declare global {
    interface Observable<T> {
        tap(callback: (value: T) => void): Observable<T>;
    }
}

export function tap<T>(callback: (value: T) => void) {
  return itemOperator(function* (value: T) {
    callback(value);
    yield value;
  });
}
