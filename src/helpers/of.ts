import { Observable } from '../index';

export function of<T>(data: T): Observable<T> {
  return new Observable<T>(function* () {
    yield data;
  });
}
