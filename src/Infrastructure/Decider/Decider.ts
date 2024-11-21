export type Decider<Command, State, Event, StateId> = {
    identify: (command: Command) => StateId;
    decide: (command: Command, state: State) => Promise<Event[]>;
    evolve: (state: State, event: Event) => State;
    initialState: () => State;
};
