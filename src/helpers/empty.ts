import { Observable } from '../index';

function* noop(): Generator<never, void> {
  // NOOP
}

export const EMPTY: Observable<never> = new Observable(() => noop);
