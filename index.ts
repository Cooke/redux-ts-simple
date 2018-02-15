export interface ActionDefinition<TPayload> {
  type: string;
  (payload?: TPayload, meta?: ActionMeta): Action<TPayload>;
}

export interface ActionMeta {}

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

export class ReducerBuilder<TState> {
  private handlers: { [key: string]: any } = {};
  private elseHandler: ReducerHandler<TState, Action<any>> | null = null;
  private everyHandler: ReducerHandler<TState, Action<any>> | null = null;

  constructor(private initState: TState) {}

  public on<TPayload>(
    actionClass: ActionDefinition<TPayload>,
    handler: ReducerHandler<TState, Action<TPayload>>
  ): this;
  public on<TPayload1, TPayload2>(
    actionClass1: ActionDefinition<TPayload1>,
    actionClass2: ActionDefinition<TPayload2>,
    handler: ReducerHandler<TState, Action<TPayload1 | TPayload2>>
  ): this;
  public on<TPayload1, TPayload2, TPayload3>(
    actionClass1: ActionDefinition<TPayload1>,
    actionClass2: ActionDefinition<TPayload2>,
    actionClass3: ActionDefinition<TPayload3>,
    handler: ReducerHandler<TState, Action<TPayload1 | TPayload2 | TPayload3>>
  ): this;
  public on(...args: any[]): this {
    for (let i = 0; i < args.length - 1; i++) {
      this.registerActionHandler(args[i], args[args.length - 1]);
    }

    return this;
  }

  public every = (handler: ReducerHandler<TState, Action<any>>): this => {
    this.everyHandler = handler;
    return this;
  }

  public else = (handler: ReducerHandler<TState, Action<any>>): this => {
    this.elseHandler = handler;
    return this;
  }

  public build(): (state: TState | undefined, action: any) => TState {
    return (state: TState | undefined, action: Action<any>): TState => {
      let handler: any = this.handlers[action.type];
      let elseHandler: any = this.elseHandler;
      let currentState: any = state || this.initState;
      if (handler) {
        currentState = handler(currentState, action);
      } else if (elseHandler) {
        currentState = elseHandler(currentState, action);
      }

      if (this.everyHandler) {
        currentState = this.everyHandler(currentState, action);
      }

      return currentState;
    };
  }

  private registerActionHandler = (actionDefinition: any, handler: any) => {
    if (this.handlers[actionDefinition.type]) {
      throw new Error(`An action handler has already been registered for the action '${actionDefinition.type}'.`);
    }

    this.handlers[actionDefinition.type] = handler;
    return this;
  }
}

// The purpose with the merge functions is to enable more type safe spread operations
export function merge<T>(existing: T, updates: Partial<T>): T {
  return { ...(<any> existing), ...(<any> updates) };
}

export function mergeInto<T>(existing: { [key: string]: T }, key: string, updates: Partial<T>): { [key: string]: T } {
  return { ...(<any> existing), [key]: merge(existing[key], updates) };
}
