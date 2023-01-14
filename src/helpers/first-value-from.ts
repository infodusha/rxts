import { AnyGenerator, Observable } from '../index';
import { generatorFrom } from './generator-from';
import { Subscription } from '../subscription';

export async function firstValueFrom<T>(observable: Observable<T>): Promise<T> {
  const sub = new Subscription();
  const generator: AnyGenerator<T> = generatorFrom(observable, sub);
  const { value } = await generator.next();
  return value;
}
