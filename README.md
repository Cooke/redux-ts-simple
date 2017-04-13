# redux-ts-simple
Yet another lib for creating typed actions and reducers.

## Usage

#### action.ts 
```typescript
import { defineAction } from "redux-ts-simple";

// Define action "types"
const ResetAction = defineAction('Reset');
const IncrementAction = defineAction<{amount: number;}>('Increment');

// Optional: create a specialized action creators
const reset = ResetAction.create;
const increment = (amount: number) => IncrementAction.create({ amount: amount });

// Alernative convention (A defined action can also be used as an action creator)
const decrement = defineAction<{ amount: number;}>('DecrementRequested'); 
let action = decrement({ amount: 1}); 
console.log(action.amount); // 1
```

**NOTE**: The library contains an alias `createAction` for the `defineAction` function, in case that model is prefered.

#### reducer.ts
```typescript
import { ReducerBuilder } from "redux-ts-simple";

const initialState = { counter: 0 };

const reducer = new ReducerBuilder(initialState)
    .on(ResetAction, () => ({ counter: 0 }))
    .on(IncrementAction, (state, action) => ({ counter: state.counter + action.amount }))
    .build();
```

#### Flux Standard Actions
The library contains a helper function (`defineStandardAction`) that makes it easier to create actions compatible with the flux standard action (FSA) convention.

```typescript
import { defineStandardAction } from "redux-ts-simple";

// Define action "types"
const IncrementAction = defineStandardAction<number>('Increment');
const increment = IncrementAction.create;
let action = increment(1);
console.log(action.payload); // 1
```