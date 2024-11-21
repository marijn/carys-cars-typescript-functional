export type CommandHandlingScenarioAssertion<SupportedCommands, SupportedEvents> = (
    given: SupportedEvents[],
    when: SupportedCommands,
    then: SupportedEvents[]
) => Promise<void>;

class CommandHandlingScenarioThenStep<SupportedEvents, SupportedCommands> {
    readonly #givenEvents: SupportedEvents[];

    readonly #whenCommand: SupportedCommands;

    readonly #thenEvents: SupportedEvents[];

    /**
     * @internal
     * @see CommandHandlingScenario.given
     * @see CommandHandlingScenario.when
     */
    constructor(
        givenEvents: SupportedEvents[],
        whenCommand: SupportedCommands,
        thenEvents: SupportedEvents[]
    ) {
        this.#givenEvents = givenEvents;
        this.#whenCommand = whenCommand;
        this.#thenEvents = thenEvents;
    }

    async assertScenario(
        assert: CommandHandlingScenarioAssertion<SupportedCommands, SupportedEvents>
    ): Promise<void> {
        return assert(this.#givenEvents, this.#whenCommand, this.#thenEvents);
    }
}

class CommandHandlingScenarioWhenStep<SupportedEvents, SupportedCommands> {
    readonly #givenEvents: SupportedEvents[];

    readonly #whenCommand: SupportedCommands;

    /**
     * @internal
     * @see CommandHandlingScenario.given
     * @see CommandHandlingScenario.when
     */
    constructor(givenEvents: SupportedEvents[], whenCommand: SupportedCommands) {
        this.#givenEvents = givenEvents;
        this.#whenCommand = whenCommand;
    }

    then(
        firstExpectedEvent: SupportedEvents,
        ...additionalExpectedEvents: SupportedEvents[]
    ): CommandHandlingScenarioThenStep<SupportedEvents, SupportedCommands> {
        const allExpectedEvents = [firstExpectedEvent, ...additionalExpectedEvents];

        return new CommandHandlingScenarioThenStep(
            this.#givenEvents,
            this.#whenCommand,
            allExpectedEvents
        );
    }

    thenNothingShouldHaveHappened(): CommandHandlingScenarioThenStep<
        SupportedEvents,
        SupportedCommands
    > {
        return new CommandHandlingScenarioThenStep(this.#givenEvents, this.#whenCommand, []);
    }
}

class CommandHandlingScenarioGivenStep<SupportedEvents, SupportedCommands> {
    readonly #givenEvents: SupportedEvents[];

    /**
     * @internal
     * @see CommandHandlingScenario.given
     */
    constructor(givenEvents: SupportedEvents[]) {
        this.#givenEvents = givenEvents;
    }

    when(
        triggeringCommand: SupportedCommands
    ): CommandHandlingScenarioWhenStep<SupportedEvents, SupportedCommands> {
        return new CommandHandlingScenarioWhenStep(this.#givenEvents, triggeringCommand);
    }
}

export class CommandHandlingScenario<SupportedEvents, SupportedCommands> {
    given(
        previouslyHappenedEvents: SupportedEvents,
        ...morePreviouslyHappenedEvents: SupportedEvents[]
    ): CommandHandlingScenarioGivenStep<SupportedEvents, SupportedCommands> {
        const allPreviouslyHappenedEvents = [previouslyHappenedEvents, ...morePreviouslyHappenedEvents];

        return new CommandHandlingScenarioGivenStep(allPreviouslyHappenedEvents);
    }

    when(
        triggeringCommand: SupportedCommands
    ): CommandHandlingScenarioWhenStep<SupportedEvents, SupportedCommands> {
        const noPreviouslyHappenedEvents: SupportedEvents[] = [];

        return new CommandHandlingScenarioGivenStep<SupportedEvents, SupportedCommands>(
            noPreviouslyHappenedEvents
        ).when(triggeringCommand);
    }
}
