interface ActionDefinition<TActionPayload> {
    type: string;
    create: (arg?: TActionPayload) => (TActionPayload & Action);
    (arg?: TActionPayload): (TActionPayload & Action);
}

interface StandardActionDefinition<TActionPayload> {
    type: string;
    create: (arg?: TActionPayload) => { payload: TActionPayload } & Action;
    (arg?: TActionPayload): { payload: TActionPayload } & Action;
}

interface Action {
    type: string;
}

export function defineAction<TActionPayload extends {}>(type: string): ActionDefinition<TActionPayload> {
    const actionCreator: any = (arg?: TActionPayload): Action & TActionPayload => {
        if ((typeof arg !== 'object') && (arg !== undefined)) {
            throw "Only object types may be used as payloads for none standard actions";
        }

        return { type: type, ...(arg || {}) } as any;
    };

    actionCreator.type = type;
    actionCreator.create = actionCreator;
    return actionCreator;
}
export const createAction = defineAction;

export function defineStandardAction<TActionPayload>(type: string): StandardActionDefinition<TActionPayload> {
    const actionCreator: any = (arg?: TActionPayload) => ({ type: type, payload: arg as TActionPayload });
    actionCreator.type = type;
    actionCreator.create = actionCreator;
    return actionCreator;
}
export const createStandardAction = defineStandardAction;

interface ReducerHandler<TState, TAction> {
    (state: TState, action: TAction): TState;
}

interface RegisterReducerHandler<TState> {
    <TActionPayload>(actionClass: ActionDefinition<TActionPayload>, handler: ReducerHandler<TState, TActionPayload & Action>): ReducerBuilder<TState>;
    <TActionPayload>(actionClass: StandardActionDefinition<TActionPayload>, handler: ReducerHandler<TState, { payload: TActionPayload } & Action>): ReducerBuilder<TState>;
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
        return (state: TState | undefined, action: Action): TState => {
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