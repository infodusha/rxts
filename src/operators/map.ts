import { Operator } from '../index';
import { itemOperator } from './index';

declare global {
    interface Observable<T> {
        map<R>(project: (value: T) => R, thisArg?: any): Observable<R>;
    }
}

export function map<T, R>(project: (value: T) => R, thisArg?: any): Operator<T, R> {
  return itemOperator(function* (value) {
    yield project.call(thisArg, value);
  });
}
