import { AnyGenerator, Observable } from '../index';
import { generatorFrom } from './generator-from';

export async function firstValueFrom<T>(observable: Observable<T>): Promise<T> {
  const generator: AnyGenerator<T> = generatorFrom(observable);
  const { value } = await generator.next();
  return value;
}
