import { EMPTY, firstValueFrom, from, generatorFrom, of } from '../src/helpers';
import { tick, toHaveBeenCalledTimesWith } from './tests';

describe('Helpers', () => {
  it('should work with fistValueFrom', async () => {
    const value = await firstValueFrom(from([1, 2, 3]));
    expect(value).toBe(1);
  });

  it('should work with generatorFrom', async () => {
    const observable$ = from([1, 2, 3]);
    const result = [];
    for await (const value of generatorFrom(observable$)) {
      result.push(value);
    }
    expect(result).toStrictEqual([1, 2, 3]);
  });

  it('should work with from', async () => {
    const next = jest.fn();
    from([1, 2, 3]).subscribe({ next });
    await tick();
    toHaveBeenCalledTimesWith(next, 1, 2, 3);
  });

  it('should work with of', async () => {
    const next = jest.fn();
    of(42).subscribe({ next });
    await tick();
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenNthCalledWith(1, 42);
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
