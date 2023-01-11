import { Observable } from '../index';

export const EMPTY: Observable<never> = new Observable(function* (): Generator<never, void> {
  // NOOP
});
