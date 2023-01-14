import { AnyGenerator, Observable } from '../index';
import { Subscription } from '../subscription';

export function generatorFrom<T>(stream: Observable<T>, sub: Subscription): AnyGenerator<T> {
  return stream._startOperator(sub);
}
