export class Subscription {
  get isCancelled(): boolean {
    return this._isCancelled;
  }

  private _isCancelled = false;

  unsubscribe() {
    this._isCancelled = true;
  }
}
