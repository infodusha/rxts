import { AnyGenerator, Observable } from '../index';

export function generatorFrom<T>(stream: Observable<T>): AnyGenerator<T> {
  return stream._startOperator();
}
