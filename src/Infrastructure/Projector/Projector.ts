export type Projector<
    SupportedEvents extends { _named: string },
    SupportedQueries extends { _named: string },
    SupportedAnswer extends { _named: string }
> = {
    ask: (query: SupportedQueries) => Promise<SupportedAnswer>;

    when: (event: SupportedEvents) => Promise<void>;

    /**
     * All events that are being listened to by this projector.
     */
    subscribesTo: SupportedEvents['_named'][];
};
