import { ReducerBuilder, createAction } from "./index";

it('should set type of action creator', () => {
    let increment = createAction<{ inc: number }>("IncAction");
    expect(increment.type).toBe("IncAction");
});

it('should set type, payload and meta of created action', () => {
    let inc = createAction<{ inc: number }>("IncAction");
    let action = inc({ inc: 123 }, { data: 'metadata' });
    expect(action.type).toBe("IncAction");
    expect(action.payload.inc).toBe(123);
    expect(action.meta).toBeDefined();
    expect((action.meta as any).data).toBe('metadata');
});

it('should set error when payload is error', () => {
    let inc = createAction<{ inc: number } | Error>("IncAction");
    let action = inc(new Error('Something bad'));
    expect(action.error).toBeTruthy();
});

it('should be able to create action without payload', () => {
    let increment = createAction("IncAction");
    let action = increment();
    expect(action.type).toBe("IncAction");
    expect(action.payload).toBeUndefined();
})

it('should be able to reduce actions', () => {
    let increment = createAction<{ inc: number }>("IncAction");
    let decrement = createAction<number>("DecAction");
    let reset = createAction("ResetAction");

    const reducer = new ReducerBuilder({ counter: 1 })
        .on(increment, (state, action) => ({ counter: state.counter + action.payload.inc }))
        .on(decrement, (state, action) => ({ counter: state.counter - action.payload }))
        .on(reset, () => ({ counter: 0 }))
        .build();

    let state = reducer(undefined, increment({ inc: 123 }));
    expect(state.counter).toBe(124);

    state = reducer(state, decrement(4));
    expect(state.counter).toBe(120);

    state = reducer(state, reset());
    expect(state.counter).toBe(0);
})

it('should be able to reduce several actions with same handler', () => {
    let increment = createAction("Inc1");
    let increase = createAction("Inc2");

    const reducer = new ReducerBuilder({ counter: 0 })
        .on(increment, increase, (state, action) => ({ counter: state.counter + 1 }))
        .build();

    let state = reducer(undefined, increment());
    expect(state.counter).toBe(1);

    state = reducer(state, increase());
    expect(state.counter).toBe(2);
})

it('should be able to reduce action with else', () => {
    let reset = createAction("ResetAction");
    
    const reducer = new ReducerBuilder({ counter: 1 })
        .on(reset, () => ({ counter: 0 }))
        .else((state, action) => action.type === 'other' ? { counter: action.payload } : state)
        .build();

    let state = reducer(undefined, { type: 'other', payload: 123 });
    expect(state.counter).toBe(123);
})

it('should be able to reduce action with every', () => {
    let reset = createAction("ResetAction");
    
    const reducer = new ReducerBuilder({ counter: 1 })
        .on(reset, () => ({ counter: 0 }))
        .every((state, action) => ({ counter: state.counter + 1}))
        .build();

    let state = reducer(undefined, reset());
    expect(state.counter).toBe(1);
})