import { defineAction, ReducerBuilder, defineStandardAction } from "./index";

it('should set type of action definition', () => {
    let IncAction = defineAction<{ inc: number }>("IncAction");
    expect(IncAction.type).toBe("IncAction");
});

it('should create action of correct type', () => {
    let IncAction = defineAction<{ inc: number }>("IncAction");
    let action = IncAction.create({ inc: 123 });
    expect(action.type).toBe("IncAction");
})

it('should be able to use defined action as an action creator', () => {
    let inc = defineAction<{ inc: number }>("IncAction");
    let action = inc({ inc: 123 });
    expect(action.type).toBe("IncAction");
    expect(action.inc).toBe(123);
})

it('should create action with correct payload', () => {
    let IncAction = defineAction<{ inc: number }>("IncAction");
    let action = IncAction.create({ inc: 123 });
    expect(action.inc).toBe(123);
})

it('should be able to create action without payload', () => {
    let IncAction = defineAction("IncAction");
    let action = IncAction.create();
    expect(action.type).toBe("IncAction");
})

it('should not be able to create action with simple payload', () => {
    let IncAction = defineAction<number>("IncAction");
    expect(() => IncAction.create(123)).toThrow();
})

it('should be able to reduce action', () => {
    let IncAction = defineAction<{ inc: number }>("IncAction");
    const reducer = new ReducerBuilder({ counter: 1 })
        .on(IncAction, (state, action) => ({ counter: state.counter + action.inc }))
        .build();

    let newState = reducer(undefined, IncAction.create({ inc: 123 }));

    expect(newState.counter).toBe(124);
})

it('should set type of standard action definition', () => {
    let IncAction = defineStandardAction<{ inc: number }>("IncAction");
    expect(IncAction.type).toBe("IncAction");
});

it('should create standard action of correct type', () => {
    let IncAction = defineStandardAction<{ inc: number }>("IncAction");
    let action = IncAction.create({ inc: 123 });
    expect(action.type).toBe("IncAction");
})

it('should create action with correct payload', () => {
    let IncAction = defineStandardAction<{ inc: number }>("IncAction");
    let action = IncAction.create({ inc: 123 });
    expect(action.payload.inc).toBe(123);
})

it("should create action with simple payload", () => {
    let IncAction = defineStandardAction<number>("IncAction");
    expect(IncAction.create(123).payload).toBe(123);
})

it('should be able to create standard action without payload', () => {
    let IncAction = defineStandardAction("IncAction");
    let action = IncAction.create();
    expect(action.type).toBe("IncAction");
})

it("should be able to reduce standard action", () => {
    let IncAction = defineStandardAction<{ inc: number }>("IncAction");
    const reducer = new ReducerBuilder({ counter: 1 })
        .on(IncAction, (state, action) => ({ counter: state.counter + action.payload.inc }))
        .build();

    let newState = reducer(undefined, IncAction.create({ inc: 123 }));

    expect(newState.counter).toBe(124);
});