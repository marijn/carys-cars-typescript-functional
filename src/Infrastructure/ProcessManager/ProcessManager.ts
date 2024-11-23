export type ProcessManager<
    SupportedEvents extends { _named: string },
    SupportedSideEffects extends { _named: string }
> = {
    processEvent: (event: SupportedEvents) => Promise<SupportedSideEffects[]>;

    /**
     * All events that are being listened to by this projector.
     */
    subscribesTo: SupportedEvents['_named'][];
};
