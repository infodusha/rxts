import { Observable } from './index';

const COMPLETE: unique symbol = Symbol('complete');

export class Subject<T> extends Observable<T> {
  private _promise: Promise<T | typeof COMPLETE> = this._getPromise();
  private _resolve?: (value: T | typeof COMPLETE) => void;
  private _isComplete = false;

  constructor() {
    super(() => {
      return async function* (this: Subject<T>) {
        while (true) {
          const value: T | typeof COMPLETE = await this._promise;
          if (value === COMPLETE) {
            return;
          }
          yield value;
        }
      };
    });
  }

  next(value: T): void {
    if (this._isComplete) {
      throw new Error('Subject is complete');
    }
    this._next(value);
  }

  complete(): void {
    this._isComplete = true;
    this._next(COMPLETE);
  }

  private _getPromise(): Promise<T | typeof COMPLETE> {
    return new Promise((resolve) => {
      this._resolve = resolve;
    });
  }

  private _next(value: T | typeof COMPLETE): void {
    const resolve = this._resolve;
    if (!resolve) {
      throw new Error('Subject has no resolver');
    }
    resolve(value);
    this._promise = this._getPromise();
  }
}
