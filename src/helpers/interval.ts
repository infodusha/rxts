import { Observable } from '../index';

export function interval(period = 0): Observable<number> {
  return new Observable<number>(async function* () {
    let i = 0;
    while (true) {
      await new Promise((resolve) => setTimeout(resolve, period));
      yield i++;
    }
  });
}
