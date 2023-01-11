import { Observable } from '../src';
import { tick, toHaveBeenCalledTimesWith } from './tests';

describe('Observable', () => {
  it('should do next', () => {
    const next = jest.fn();
    const observable$ = new Observable(function* () {
      yield 1;
      yield 2;
      yield 3;
    });
    observable$.subscribe({ next });
    toHaveBeenCalledTimesWith(next, 1, 2, 3);
  });

  it('should do next twice', () => {
    const next1 = jest.fn();
    const next2 = jest.fn();
    const observable$ = new Observable(function* () {
      yield 1;
      yield 2;
      yield 3;
    });
    observable$.subscribe({ next: next1 });
    observable$.subscribe({ next: next2 });
    toHaveBeenCalledTimesWith(next1, 1, 2, 3);
    toHaveBeenCalledTimesWith(next2, 1, 2, 3);
  });

  it('should do complete', () => {
    const complete = jest.fn();
    const observable$ = new Observable(function* () {
      yield 1;
      yield 2;
      yield 3;
    });
    observable$.subscribe({ complete });
    expect(complete).toHaveBeenCalledTimes(1);
  });

  it('should throw error', () => {
    const error = jest.fn();
    const DUMMY_ERROR = new Error('DUMMY_ERROR');
    const observable$ = new Observable(function* () {
      yield 1;
      throw DUMMY_ERROR;
    });
    observable$.subscribe({ error });
    expect(error).toHaveBeenCalledTimes(1);
    expect(error).toHaveBeenCalledWith(DUMMY_ERROR);
  });

  it('should unsubscribe', () => {
    const next = jest.fn();
    const observable$ = new Observable(function* () {
      yield 1;
      yield 2;
      sub.unsubscribe();
      yield 3;
    });
    const sub = observable$.subscribe({ next });
    toHaveBeenCalledTimesWith(next, 1, 2);
  });

  it('should unsubscribe with tap', async () => {
    const tapCall = jest.fn();
    const observable$ = new Observable(function* () {
      yield 1;
      yield 2;
      sub.unsubscribe();
      yield 3;
    });
    const sub = observable$.tap(tapCall).subscribe();
    await tick();
    toHaveBeenCalledTimesWith(tapCall, 1, 2);
  });
});
