export async function tick(time = 0): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

export function toHaveBeenCalledTimesWith(actual: jest.Mock, ...params: unknown[]): void {
  expect(actual).toHaveBeenCalledTimes(params.length);
  for (let i = 0; i < params.length; i++) {
    expect(actual).toHaveBeenNthCalledWith(i + 1, params[i]);
  }
}
