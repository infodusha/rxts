import { defer, EMPTY, firstValueFrom, from, generatorFrom, interval, lastValueFrom, of } from '../src/helpers';
import { tick, toHaveBeenCalledTimesWith } from './tests';

describe('Helpers', () => {
  it('should work with fistValueFrom', async () => {
    const value = await firstValueFrom(from([1, 2, 3]));
    expect(value).toBe(1);
  });

  it('should work with lastValueFrom', async () => {
    const value = await lastValueFrom(from([1, 2, 3]));
    expect(value).toBe(3);
  });

  it('should work with generatorFrom', async () => {
    const observable$ = from([1, 2, 3]);
    const result = [];
    for await (const value of generatorFrom(observable$)) {
      result.push(value);
    }
    expect(result).toStrictEqual([1, 2, 3]);
  });

  it('should work with from observable', async () => {
    const next = jest.fn();
    from(from([1, 2, 3])).subscribe({ next });
    await tick();
    toHaveBeenCalledTimesWith(next, 1, 2, 3);
  });

  it('should work with from iterable', async () => {
    const next = jest.fn();
    from([1, 2, 3]).subscribe({ next });
    await tick();
    toHaveBeenCalledTimesWith(next, 1, 2, 3);
  });

  it('should work with from async iterable', async () => {
    const next = jest.fn();
    async function* asyncIterable() {
      yield 1;
      yield 2;
      yield 3;
    }
    from(asyncIterable()).subscribe({ next });
    await tick();
    toHaveBeenCalledTimesWith(next, 1, 2, 3);
  });

  it('should work with from promise', async () => {
    const next = jest.fn();
    from(Promise.resolve(1)).subscribe({ next });
    await tick();
    toHaveBeenCalledTimesWith(next, 1);
  });

  it('should work with of', async () => {
    const next = jest.fn();
    of(42).subscribe({ next });
    await tick();
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenNthCalledWith(1, 42);
  });

  it('should work with defer', async () => {
    const next = jest.fn();
    const build = jest.fn((resolve) => resolve(1));
    const observable$ = defer(() => new Promise(build));
    await tick();
    expect(build).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
    observable$.subscribe({ next });
    await tick();
    expect(build).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenNthCalledWith(1, 1);
  });

  it('should work with interval', async () => {
    const next = jest.fn();
    const sub = interval(100).subscribe({ next });
    await tick();
    expect(next).not.toHaveBeenCalled();
    await tick(100);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenNthCalledWith(1, 0);
    await tick(100);
    expect(next).toHaveBeenCalledTimes(2);
    expect(next).toHaveBeenNthCalledWith(2, 1);
    await tick(100);
    expect(next).toHaveBeenCalledTimes(3);
    expect(next).toHaveBeenNthCalledWith(3, 2);

    sub.unsubscribe();
    await tick(100);
    expect(next).toHaveBeenCalledTimes(3);
    await tick(100);
    expect(next).toHaveBeenCalledTimes(3);
  });

  it('should work with EMPTY', async () => {
    const next = jest.fn();
    const complete = jest.fn();
    EMPTY.subscribe({ next, complete });
    await tick();
    expect(next).not.toHaveBeenCalled();
    expect(complete).toHaveBeenCalledTimes(1);
  });
});
