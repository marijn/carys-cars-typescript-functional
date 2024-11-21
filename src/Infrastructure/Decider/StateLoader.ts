export interface StateLoader<States> {
    loadStateOrDefaultTo(stateId: string, defaultState: States): Promise<States>;

    store(stateId: string, state: States): Promise<void>;
}
