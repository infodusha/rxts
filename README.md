# RxTS

*Warning: The package is under early development and not recommended for production usage. The API may be changed.*

## Installation

```shell
npm install rxts
```

## Usage
```ts
import { from } from 'rxts/helpers';
import { filter, map } from 'rxts/operators';

from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    .filter(x => x % 2 === 1)
    .map(x => x + x)
    .subscribe(x => console.log(x));
```

## Operators
* tap
* map
* filter
* switchMap
* take
* delay
* distinctUntilChanged
* startWith

## Helpers
* from
* of
* firstValueFrom
* lastValueFrom
* defer
* EMPTY
* generatorFrom
* interval

## Building/Testing

- `npm run build` build everything
- `npm test` run tests
- `npm run lint` run linting
