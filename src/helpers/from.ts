import { Observable } from '../index';
import { isAsync } from '../internal';
import { ObservableInput } from './index';

export function from<T>(data: ObservableInput<T>): Observable<T> {
  if (data instanceof Observable) {
    return data;
  }
  if (data instanceof Promise || isAsync(data)) {
    return new Observable<T>(async function* () {
      if (data instanceof Promise) {
        yield await data;
        return;
      }
      for await (const item of data) {
        yield item;
      }
    });
  }
  return new Observable<T>(function* () {
    for (const item of data) {
      yield item;
    }
  });
}
