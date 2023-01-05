import { AnyGenerator } from './index';

export function isAsync<T>(iterable: AsyncIterable<T> | Iterable<T>) : iterable is AsyncIterable<T>;
export function isAsync<T>(generator: AnyGenerator<T>): generator is AsyncGenerator<T>;
export function isAsync<T>(generatorOrIterable: AnyGenerator<T> | AsyncIterable<T> | Iterable<T>): boolean {
  return (generatorOrIterable as AsyncIterable<T>)[Symbol.asyncIterator] !== undefined;
}
