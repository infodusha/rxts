import { Observable, Operator } from '../index';
import { generatorFrom } from '../helpers/';
import { itemOperator } from './index';

declare global {
    interface Observable<T> {
        switchMap<R>(callback: (value: T) => Observable<R>): Observable<T>;
    }
}

// TODO That may be works as mergeMap, i am not sure about that
export function switchMap<T, R>(callback: (value: T) => Observable<R>): Operator<T, R> {
  return itemOperator(async function* (value: T) {
    yield* generatorFrom(callback(value));
  });
}
