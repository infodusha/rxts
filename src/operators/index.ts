import { Observable, StartOperator } from '../index';

import { tap } from './tap';
import { map } from './map';
import { switchMap } from './switch-map';
import { filter } from './filter';
import { delay } from './delay';
import { take } from './take';
import { distinctUntilChanged } from './distinct-until-changed';
import { startWith } from './start-with';

export function registerOperator<T, K extends keyof Observable<T>>(key: K, operator: (...args: Parameters<Observable<T>[K]>) => (startOperator: StartOperator<T>) => StartOperator<T>): void {
  if (key in Observable.prototype) {
    throw new Error(`${key} already exists in Observable`);
  }

  Object.defineProperty(Observable.prototype, key, {
    get(): (...args: Parameters<Observable<T>[K]>) => Observable<T> {
      const startOperator: StartOperator<T> = this._startOperator.bind(this);
      return (...args: Parameters<Observable<T>[K]>) => {
        const op = operator(...args);
        return new Observable<T>(() => op(startOperator));
      };
    },
  });
}

registerOperator('tap', tap);
registerOperator('map', map);
registerOperator('switchMap', switchMap);
registerOperator('filter', filter);
registerOperator('delay', delay);
registerOperator('take', take);
registerOperator('distinctUntilChanged', distinctUntilChanged);
registerOperator('startWith', startWith);
