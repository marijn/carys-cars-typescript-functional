type Named = { _named: string };

export type ProcessManagerScenarioAssertion<
    SupportedEvents extends Named,
    SupportedSideEffects extends Named
> = (
    given: SupportedEvents[],
    when: SupportedEvents,
    then: SupportedSideEffects[]
) => Promise<void>;

export type ProcessManagerScenarioErrorAssertion<SupportedEvents extends Named> = (
    given: SupportedEvents[],
    when: SupportedEvents,
    then: Error
) => Promise<void>;

export class ProcessManagerScenario<
    SupportedEvents extends Named,
    SupportedSideEffects extends Named
> {
    given(
        previouslyHappenedEvent: SupportedEvents,
        ...morePreviouslyHappenedEvents: SupportedEvents[]
    ): ProcessManagerScenarioGivenStep<SupportedEvents, SupportedSideEffects> {
        const allPreviouslyHappenedEvents = [previouslyHappenedEvent, ...morePreviouslyHappenedEvents];

        return new ProcessManagerScenarioGivenStep(allPreviouslyHappenedEvents);
    }

    when(
        triggeringEvent: SupportedEvents
    ): ProcessManagerScenarioWhenStep<SupportedEvents, SupportedSideEffects> {
        const allPreviouslyHappenedEvents: SupportedEvents[] = [];

        return new ProcessManagerScenarioGivenStep<SupportedEvents, SupportedSideEffects>(
            allPreviouslyHappenedEvents
        ).when(triggeringEvent);
    }
}

class ProcessManagerScenarioGivenStep<
    SupportedEvents extends Named,
    SupportedSideEffects extends Named
> {
    readonly #givenEvents: SupportedEvents[];

    /**
     * @internal
     * @see ProcessManagerScenario.given
     */
    constructor(givenEvents: SupportedEvents[]) {
        this.#givenEvents = givenEvents;
    }

    when(
        triggeringEvent: SupportedEvents
    ): ProcessManagerScenarioWhenStep<SupportedEvents, SupportedSideEffects> {
        return new ProcessManagerScenarioWhenStep(this.#givenEvents, triggeringEvent);
    }
}

class ProcessManagerScenarioWhenStep<
    SupportedEvents extends Named,
    SupportedSideEffects extends Named
> {
    readonly #givenEvents: SupportedEvents[];

    readonly #whenEvent: SupportedEvents;

    /**
     * @internal
     * @see ProcessManagerScenario.given
     * @see ProcessManagerScenario.when
     */
    constructor(givenEvents: SupportedEvents[], whenEvent: SupportedEvents) {
        this.#givenEvents = givenEvents;
        this.#whenEvent = whenEvent;
    }

    then(
        firstExpectedEventOrCommand: SupportedSideEffects,
        ...additionalExpectedEventsOrCommands: SupportedSideEffects[]
    ): ProcessManagerScenarioThenStep<SupportedEvents, SupportedSideEffects> {
        const allExpectedEventsOrCommands = [
            firstExpectedEventOrCommand,
            ...additionalExpectedEventsOrCommands,
        ];

        return new ProcessManagerScenarioThenStep(
            this.#givenEvents,
            this.#whenEvent,
            allExpectedEventsOrCommands
        );
    }

    thenNothingShouldHaveHappened(): ProcessManagerScenarioThenStep<
        SupportedEvents,
        SupportedSideEffects
    > {
        return new ProcessManagerScenarioThenStep(this.#givenEvents, this.#whenEvent, []);
    }

    thenAnUnexpectedErrorIsThrown(
        error: Error
    ): ProcessManagerScenarioThenUnexpectedErrorStep<SupportedEvents> {
        return new ProcessManagerScenarioThenUnexpectedErrorStep(
            this.#givenEvents,
            this.#whenEvent,
            error
        );
    }
}

class ProcessManagerScenarioThenStep<
    SupportedEvents extends Named,
    SupportedSideEffects extends Named
> {
    readonly #givenEvents: SupportedEvents[];

    readonly #whenEvent: SupportedEvents;

    readonly #thenEventsOrCommands: SupportedSideEffects[];

    /**
     * @internal
     * @see ProcessManagerScenario.given
     * @see ProcessManagerScenario.when
     */
    constructor(
        givenEvents: SupportedEvents[],
        whenEvent: SupportedEvents,
        thenEventsOrCommands: SupportedSideEffects[]
    ) {
        this.#givenEvents = givenEvents;
        this.#whenEvent = whenEvent;
        this.#thenEventsOrCommands = thenEventsOrCommands;
    }

    async assertScenario(
        assert: ProcessManagerScenarioAssertion<SupportedEvents, SupportedSideEffects>
    ): Promise<void> {
        await assert(this.#givenEvents, this.#whenEvent, this.#thenEventsOrCommands);
    }
}

class ProcessManagerScenarioThenUnexpectedErrorStep<SupportedEvents extends Named> {
    readonly #givenEvents: SupportedEvents[];

    readonly #whenEvent: SupportedEvents;

    readonly #thenUnexpectedError: Error;

    /**
     * @internal
     * @see ProcessManagerScenario.given
     * @see ProcessManagerScenario.when
     */
    constructor(
        givenEvents: SupportedEvents[],
        whenEvent: SupportedEvents,
        thenUnexpectedError: Error
    ) {
        this.#givenEvents = givenEvents;
        this.#whenEvent = whenEvent;
        this.#thenUnexpectedError = thenUnexpectedError;
    }

    async assertScenario(
        assert: ProcessManagerScenarioErrorAssertion<SupportedEvents>
    ): Promise<void> {
        return assert(this.#givenEvents, this.#whenEvent, this.#thenUnexpectedError);
    }
}
