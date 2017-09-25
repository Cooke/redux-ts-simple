# redux-ts-simple
Yet another lib for creating typed actions and reducers. This library is FSA-compliant.

## Installing

```bash
npm install redux-ts-simple
```

## Usage

#### action.ts 
```typescript
import { createAction } from "redux-ts-simple";

// Define action creators
const reset = createAction('Reset');
const increment = createAction<number>('Increment');
const set = createAction<{ value: number }>('Set');

// Usage
dispatch(reset());
dispatch(increment(100));
dispatch(set({ value: 333 }));

// Error and meta
const fetch = createAction<string | Error>('Fetch');
const fetchAction = fetch(new Error('Something went wrong'), { url: '/posts/1' });
console.log(fetchAction.error); // true
console.log(fetchAction.meta.url); // /posts/1
```

#### reducer.ts
```typescript
import { ReducerBuilder } from "redux-ts-simple";

const initialState = { counter: 0, version: 0 };

const reducer = new ReducerBuilder(initialState)
    .on(reset,       () => ({ counter: 0 }))
    .on(increment,   (state, action) => ({ counter: state.counter + action.payload }))
    .on(set,         (state, action) => ({ counter: state.counter + action.payload.value }))
    .on(clear, wipe, (state) => ({ counter: 0}) // Several actions with same handler
    .else(           (state, action) => state) // Extensibility point 
    .every(          (state, action) => ({ version: state.version + 1}) // Executed after every action and else handler with the new state as input
    .build();
```
