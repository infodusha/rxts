import { AnyGenerator, Observable } from '../index';
import { generatorFrom } from './generator-from';
import { Subscription } from '../subscription';

export async function lastValueFrom<T>(observable: Observable<T>): Promise<T> {
  const empty: unique symbol = Symbol('empty');
  const sub = new Subscription();
  const generator: AnyGenerator<T> = generatorFrom(observable, sub);
  let lastValue: T | typeof empty = empty;
  for await (const value of generator) {
    lastValue = value;
  }
  if (lastValue === empty) {
    throw new Error('EmptyError');
  }
  return lastValue;
}
