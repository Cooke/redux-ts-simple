export interface ActionDefinition<TPayload> {
    type: string;
    (payload?: TPayload, meta?: ActionMeta): Action<TPayload>;
}

export interface ActionMeta {
}

export interface Action<TPayload> {
    type: string;
    payload: TPayload;
    error?: boolean;
    meta?: ActionMeta;
}

export function createAction<TPayload>(type: string): ActionDefinition<TPayload> {
    const actionCreator: any = (payload: TPayload, meta: ActionMeta): Action<TPayload> => ({
        type: type,
        payload: payload,
        meta: meta,
        error: payload instanceof Error
    });
    actionCreator.type = type;
    return actionCreator;
}

interface ReducerHandler<TState, TAction> {
    (state: TState, action: TAction): TState;
}

interface RegisterReducerHandler<TState> {
    <TPayload>(
        actionClass: ActionDefinition<TPayload>,
        handler: ReducerHandler<TState, Action<TPayload>>): ReducerBuilder<TState>;
}

export class ReducerBuilder<TState> {
    private handlers: { [key: string]: any } = {};

    constructor(private initState: TState) {
    }

    public on: RegisterReducerHandler<TState> = (actionDefinition: any, handler: any) => {
        // TODO check if already registered
        this.handlers[actionDefinition.type] = handler;
        return this;
    }

    public build() {
        return (state: TState | undefined, action: Action<any>): TState => {
            let handler = this.handlers[action.type];
            let currentState = state || this.initState;
            if (handler) {
                return handler(currentState, action);
            } else {
                return currentState;
            }
        }
    }
}

export function merge<T>(existing: T, updates: Partial<T>): T {
    return { ...<any>existing, ...<any>updates };
};

export function mergeInto<T>(existing: { [key: string]: T }, key: string, updates: Partial<T>): { [key: string]: T } {
    return { ...<any>existing, [key]: merge(existing[key], updates) };
};