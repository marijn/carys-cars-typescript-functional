import { expect } from '@jest/globals';
import { CommandHandlingScenarioAssertion } from './CommandHandlingScenario';
import {Decider} from "../Decider";

export const runAssertionOnDecider =
    <SupportedCommands, SupportedEvents, SupportedStates>(
        decider: Decider<SupportedCommands, SupportedStates, SupportedEvents, string>
    ): CommandHandlingScenarioAssertion<SupportedCommands, SupportedEvents> =>
        async (givens, when, then) => {
            const initialState = givens.reduce(decider.evolve, decider.initialState());
            const actual = await decider.decide(when, initialState);

            const expected = then;
            expect(actual).toEqual(expected);

            return Promise.resolve();
        };
