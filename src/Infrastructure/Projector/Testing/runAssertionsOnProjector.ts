import {QueryHandlingScenarioAssertion} from './QueryHandlingScenario';
import {expect} from '@jest/globals';
import {Projector} from "../Projector";

export const runAssertionsOnProjector: <
    SupportedEvents extends { _named: string },
    SupportedQueries extends { _named: string },
    SupportedAnswers extends { _named: string }
>(
    projector: Projector<SupportedEvents, SupportedQueries, SupportedAnswers>
) => QueryHandlingScenarioAssertion<SupportedEvents, SupportedQueries, SupportedAnswers> = (projector) => {
    return async (givens, when, then) => {
        for (const preCondition of givens) {
            await projector.when(preCondition);
        }

        const actual = await projector.ask(when);
        const expected = then;

        expect(actual).toEqual(expected);
    };
};
