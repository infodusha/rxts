import { AnyGenerator, Observable, Operator } from '../index';

import { tap } from './tap';
import { map } from './map';
import { switchMap } from './switch-map';
import { filter } from './filter';
import { delay } from './delay';
import { take } from './take';
import { distinctUntilChanged } from './distinct-until-changed';
import { startWith } from './start-with';
import { Subscription } from '../subscription';

type OperatorObserved<K> = K extends (...args: never[]) => Observable<infer T> ? T : never;

type OperatorFn<T, K extends keyof Observable<T>> = (...args: Parameters<Observable<T>[K]>) => Operator<T, OperatorObserved<Observable<T>[K]>>

export function registerOperator<T, K extends keyof Observable<T>>(key: K, operator: OperatorFn<T, K>): void {
  if (key in Observable.prototype) {
    throw new Error(`${key} already exists in Observable`);
  }

  Object.defineProperty(Observable.prototype, key, {
    get(): (...args: Parameters<Observable<T>[K]>) => Observable<OperatorObserved<Observable<T>[K]>> {
      return (...args: Parameters<Observable<T>[K]>) => {
        return operator(...args)(this);
      };
    },
  });
}

export function itemOperator<T, R>(operator: (item: T) => AnyGenerator<R>): (obs$: Observable<T>) => Observable<R> {
  return (obs$) => new Observable<R>(() => async function* (sub?: Subscription) {
    if (sub?.isCancelled) return;
    const generator = obs$._startOperator(sub);
    for await (const value of generator) {
      if (sub?.isCancelled) return;
      yield* operator(value);
    }
  });
}

export function operator<T, R>(operator: (generator: AnyGenerator<T>, sub?: Subscription) => AnyGenerator<R>): (obs$: Observable<T>) => Observable<R> {
  return (obs$) => new Observable<R>(() => async function* (sub?: Subscription) {
    if (sub?.isCancelled) return;
    const generator = obs$._startOperator(sub);
    for await (const value of operator(generator, sub)) {
      if (sub?.isCancelled) return;
      yield value;
    }
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
