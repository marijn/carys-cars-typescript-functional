export type QueryHandlingScenarioAssertion<SupportedEvents, SupportedQueries, SupportedAnswers> = (
    given: SupportedEvents[],
    when: SupportedQueries,
    then: SupportedAnswers
) => Promise<void>;

class QueryHandlingScenarioThenStep<SupportedEvents, SupportedQueries, SupportedAnswers> {
    readonly #givenEvents: SupportedEvents[];

    readonly #whenQuery: SupportedQueries;

    readonly #thenAnswer: SupportedAnswers;

    /**
     * @internal
     * @see CommandHandlingScenario.given
     * @see CommandHandlingScenario.when
     */
    constructor(
        givenEvents: SupportedEvents[],
        whenQuery: SupportedQueries,
        thenAnswer: SupportedAnswers
    ) {
        this.#givenEvents = givenEvents;
        this.#whenQuery = whenQuery;
        this.#thenAnswer = thenAnswer;
    }

    async assertScenario(
        assert: QueryHandlingScenarioAssertion<SupportedEvents, SupportedQueries, SupportedAnswers>
    ): Promise<void> {
        return assert(this.#givenEvents, this.#whenQuery, this.#thenAnswer);
    }
}

class QueryHandlingScenarioWhenStep<SupportedEvents, SupportedQueries, SupportedAnswers> {
    readonly #givenEvents: SupportedEvents[];

    readonly #whenQuery: SupportedQueries;

    /**
     * @internal
     * @see CommandHandlingScenario.given
     * @see CommandHandlingScenario.when
     */
    constructor(givenEvents: SupportedEvents[], whenQuery: SupportedQueries) {
        this.#givenEvents = givenEvents;
        this.#whenQuery = whenQuery;
    }

    then(
        expectedAnswer: SupportedAnswers
    ): QueryHandlingScenarioThenStep<SupportedEvents, SupportedQueries, SupportedAnswers> {
        return new QueryHandlingScenarioThenStep(this.#givenEvents, this.#whenQuery, expectedAnswer);
    }
}

class QueryHandlingScenarioGivenStep<SupportedEvents, SupportedQueries, SupportedAnswers> {
    readonly #givenEvents: SupportedEvents[];

    /**
     * @internal
     * @see CommandHandlingScenario.given
     */
    constructor(givenEvents: SupportedEvents[]) {
        this.#givenEvents = givenEvents;
    }

    when(
        triggeringQuery: SupportedQueries
    ): QueryHandlingScenarioWhenStep<SupportedEvents, SupportedQueries, SupportedAnswers> {
        return new QueryHandlingScenarioWhenStep(this.#givenEvents, triggeringQuery);
    }
}

export class QueryHandlingScenario<SupportedEvents, SupportedQueries, SupportedAnswers> {
    given(
        previouslyHappenedEvents: SupportedEvents,
        ...morePreviouslyHappenedEvents: SupportedEvents[]
    ): QueryHandlingScenarioGivenStep<SupportedEvents, SupportedQueries, SupportedAnswers> {
        const allPreviouslyHappenedEvents = [previouslyHappenedEvents, ...morePreviouslyHappenedEvents];

        return new QueryHandlingScenarioGivenStep(allPreviouslyHappenedEvents);
    }

    when(
        triggeringQuery: SupportedQueries
    ): QueryHandlingScenarioWhenStep<SupportedEvents, SupportedQueries, SupportedAnswers> {
        const noPreviouslyHappenedEvents: SupportedEvents[] = [];

        return new QueryHandlingScenarioGivenStep<SupportedEvents, SupportedQueries, SupportedAnswers>(
            noPreviouslyHappenedEvents
        ).when(triggeringQuery);
    }
}
