import {ProcessManager} from "../ProcessManager";
import {expect} from "@jest/globals";
import {ProcessManagerScenarioAssertion, ProcessManagerScenarioErrorAssertion} from "./ProcessManagerScenario";

type Named = { _named: string };

export const runAssertionOnProcessManager: <
    SupportedEvents extends Named,
    SupportedSideEffects extends Named
>(
    subjectUnderTest: ProcessManager<SupportedEvents, SupportedSideEffects>
) => ProcessManagerScenarioAssertion<SupportedEvents, SupportedSideEffects> = (subjectUnderTest) => {
    return async (given, when, then): Promise<void> => {
        for (const givenEvent of given) {
            await subjectUnderTest.processEvent(givenEvent);
        }

        const actual = await subjectUnderTest.processEvent(when);

        const expected = then;
        expect(JSON.parse(JSON.stringify(actual))).toEqual(JSON.parse(JSON.stringify(expected)));

        return Promise.resolve();
    };
}


export const runErrorAssertionOnProcessManager: <
    SupportedEvents extends Named,
    SupportedSideEffects extends Named
>(
    subjectUnderTest: ProcessManager<SupportedEvents, SupportedSideEffects>
) => ProcessManagerScenarioErrorAssertion<SupportedEvents> = (subjectUnderTest) => {
    return async (given, when, thenUnexpectedError): Promise<void> => {
        for (const givenEvent of given) {
            await subjectUnderTest.processEvent(givenEvent);
        }

        let actualError;

        try {
            await subjectUnderTest.processEvent(when);
        } catch (e) {
            actualError = e;
        } finally {
            // TODO: If the assertion fails, check what the return value was from the process manager and display that.
            expect(actualError).toEqual(thenUnexpectedError);
        }

        return Promise.resolve();
    };
}
