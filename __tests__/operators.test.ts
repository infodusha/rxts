import { from } from '../src/helpers';
import { tick, toHaveBeenCalledTimesWith } from './tests';

describe('Operators', () => {
  it('should work with tap', async () => {
    const tapCall = jest.fn();
    from([1, 2, 3]).tap(tapCall).subscribe();
    await tick();
    toHaveBeenCalledTimesWith(tapCall, 1, 2, 3);
  });

  it('should work with map', async () => {
    const next = jest.fn();
    from([1, 2, 3]).map((x) => x * 2).subscribe({ next });
    await tick();
    toHaveBeenCalledTimesWith(next, 2, 4, 6);
  });

  it('should work with switchMap', async () => {
    const next = jest.fn();
    from([1, 2, 3])
      .switchMap((x) => from(Array.from({ length: x }, (_, i) => i)))
      .subscribe({ next });
    await tick();
    toHaveBeenCalledTimesWith(next, 0, 0, 1, 0, 1, 2);
  });

  it('should work with filter', async () => {
    const next = jest.fn();
    from([1, 2, 3, 4]).filter((x) => x > 2).subscribe({ next });
    await tick();
    toHaveBeenCalledTimesWith(next, 3, 4);
    expect(next).toHaveBeenCalledTimes(2);
    expect(next).toHaveBeenNthCalledWith(1, 3);
    expect(next).toHaveBeenNthCalledWith(2, 4);
  });

  it('should infer types up to 9 operators', async () => {
    const next = jest.fn();
    from([1, 2, 3])
      .map((x) => x.toString())
      .map((x) => [x])
      .map((x) => x[0])
      .map(Number)
      .subscribe({ next });
    await tick();
    toHaveBeenCalledTimesWith(next, 1, 2, 3);
  });

  it('should work with delay', async () => {
    const next = jest.fn();
    from([1, 2, 3]).delay(100).subscribe({ next });
    await tick();
    expect(next).not.toHaveBeenCalled();
    await tick(100);
    toHaveBeenCalledTimesWith(next, 1, 2, 3);
  });

  it('should work with take', async () => {
    const next = jest.fn();
    from([1, 2, 3, 4]).take(2).subscribe({ next });
    await tick();
    await tick(100);
    toHaveBeenCalledTimesWith(next, 1, 2);
  });

  it('should work with distinctUntilChanged', async () => {
    const next = jest.fn();
    from([1, 2, 2, 2, 3, 4, 4]).distinctUntilChanged().subscribe({ next });
    await tick();
    toHaveBeenCalledTimesWith(next, 1, 2, 3, 4);
  });

  it('should work with distinctUntilChanged with comparator', async () => {
    const next = jest.fn();
    from([{ id: 1 }, { id: 2 }, { id: 2 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 4 }])
      .distinctUntilChanged((previous, current) => previous.id === current.id)
      .subscribe({ next });
    await tick();
    toHaveBeenCalledTimesWith(next, { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 });
  });
});
