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