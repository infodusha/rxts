import { Subject } from '../src/subject';
import { tick } from './tests';

describe('Subject', () => {
  it('should work', async () => {
    const subject$ = new Subject<number>();

    const next = jest.fn();
    subject$.subscribe({ next });

    subject$.next(1);
    await tick();
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenNthCalledWith(1, 1);
    subject$.next(2);
    await tick();
    expect(next).toHaveBeenCalledTimes(2);
    expect(next).toHaveBeenNthCalledWith(2, 2);
    subject$.next(3);
    await tick();
    expect(next).toHaveBeenCalledTimes(3);
    expect(next).toHaveBeenNthCalledWith(3, 3);
  });

  it('should complete', async () => {
    const subject$ = new Subject<number>();

    const complete = jest.fn();
    subject$.subscribe({ complete });

    subject$.next(1);
    await tick();
    expect(complete).not.toHaveBeenCalled();
    subject$.complete();
    await tick();
    expect(complete).toHaveBeenCalledTimes(1);
  });

  it('should work with multiple subscribers', async () => {
    const subject$ = new Subject<number>();

    const next1 = jest.fn();
    const next2 = jest.fn();
    subject$.subscribe({ next: next1 });
    subject$.subscribe({ next: next2 });

    subject$.next(1);
    await tick();
    expect(next1).toHaveBeenCalledTimes(1);
    expect(next1).toHaveBeenNthCalledWith(1, 1);
    expect(next2).toHaveBeenCalledTimes(1);
    expect(next2).toHaveBeenNthCalledWith(1, 1);
    subject$.next(2);
    await tick();
    expect(next1).toHaveBeenCalledTimes(2);
    expect(next1).toHaveBeenNthCalledWith(2, 2);
    expect(next2).toHaveBeenCalledTimes(2);
    expect(next2).toHaveBeenNthCalledWith(2, 2);
    subject$.next(3);
    await tick();
    expect(next1).toHaveBeenCalledTimes(3);
    expect(next1).toHaveBeenNthCalledWith(3, 3);
    expect(next2).toHaveBeenCalledTimes(3);
    expect(next2).toHaveBeenNthCalledWith(3, 3);
  });

  it('should work with pipe', async () => {
    const subject$ = new Subject<number>();

    const next = jest.fn();
    subject$.map((x) => x * 2).subscribe({ next });

    subject$.next(1);
    await tick();
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenNthCalledWith(1, 2);
    subject$.next(2);
    await tick();
    expect(next).toHaveBeenCalledTimes(2);
    expect(next).toHaveBeenNthCalledWith(2, 4);
    subject$.next(3);
    await tick();
    expect(next).toHaveBeenCalledTimes(3);
    expect(next).toHaveBeenNthCalledWith(3, 6);
  });

  it('should work with pipe and multiple subscribers', async () => {
    const subject$ = new Subject<number>();

    const next1 = jest.fn();
    const next2 = jest.fn();
    const observable$ = subject$.map((x) => x * 2);
    observable$.subscribe({ next: next1 });
    observable$.subscribe({ next: next2 });

    subject$.next(1);
    await tick();
    expect(next1).toHaveBeenCalledTimes(1);
    expect(next1).toHaveBeenNthCalledWith(1, 2);
    expect(next2).toHaveBeenCalledTimes(1);
    expect(next2).toHaveBeenNthCalledWith(1, 2);
    subject$.next(2);
    await tick();
    expect(next1).toHaveBeenCalledTimes(2);
    expect(next1).toHaveBeenNthCalledWith(2, 4);
    expect(next2).toHaveBeenCalledTimes(2);
    expect(next2).toHaveBeenNthCalledWith(2, 4);
    subject$.next(3);
    await tick();
    expect(next1).toHaveBeenCalledTimes(3);
    expect(next1).toHaveBeenNthCalledWith(3, 6);
    expect(next2).toHaveBeenCalledTimes(3);
    expect(next2).toHaveBeenNthCalledWith(3, 6);
  });
});
