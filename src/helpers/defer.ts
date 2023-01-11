import { Observable } from '../index';
import { generatorFrom } from './generator-from';
import { from, ObservableInput } from './index';

export function defer<T>(observableFactory: () => ObservableInput<T>): Observable<T> {
  return new Observable<T>(async function* () {
    yield* await generatorFrom(from(observableFactory()));
  });
}
