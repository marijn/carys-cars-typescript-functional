import {PriceOfTripWasCalculated} from "./PriceOfTripWasCalculated";
import {PleaseCalculatePriceOfTrip} from "./PleaseCalculatePriceOfTrip";
import {launchPricingPerMinute, PricingPolicy} from "./LaunchingPricing";
import {Decider} from "../../Infrastructure/Decider/Decider";
import {TripId} from "./TripId";

type TripIsNotPriced = Readonly<{
    _named: "TripIsNotPriced",
}>;

type TripIsPriced = Readonly<{
    _named: "TripIsPriced",
}>;

export type PricingEvents = | PriceOfTripWasCalculated;

export type PricingCommands = | PleaseCalculatePriceOfTrip;

type PricingStates =
    | TripIsNotPriced
    | TripIsPriced;

export const buildPricingDecider: (pricingPolicy: PricingPolicy) => Decider<PricingCommands, PricingStates, PricingEvents, TripId> = (
    pricingPolicy
) => {
    const decideToPleaseCalculatePriceOfTrip: (
        state: PricingStates,
        command: PleaseCalculatePriceOfTrip
    ) => Promise<PricingEvents[]> = (state, command) => {
        if ('TripIsPriced' === state._named) {
            return Promise.resolve([]);
        }

        return Promise.resolve([
            {
                _named: "Price of trip was calculated",
                tripId: command.tripId,
                vehicle: command.vehicle,
                agreementId: command.agreementId,
                durationOfTrip: command.durationOfTrip,
                tripDistance: command.tripDistance,
                pricePerMinute: launchPricingPerMinute,
                totalPrice: pricingPolicy(command.tripDistance, command.durationOfTrip),
                customerId: command.customerId,
            }
        ]);
    };

    return {
        decide(command: PricingCommands, state: PricingStates): Promise<PricingEvents[]> {
            switch (command._named) {
                case "Please calculate price of trip": {
                    return decideToPleaseCalculatePriceOfTrip(state, command);
                }
            }
        },
        evolve(state: PricingStates, event: PricingEvents): PricingStates {
            switch (event._named) {
                case "Price of trip was calculated": {
                    return {
                        _named: "TripIsPriced",
                    };
                }
                default: {
                    return state;
                }
            }
        },
        identify(command: PricingCommands): TripId {
            throw new Error('TODO: Implement me');
        },
        initialState(): PricingStates {
            return {
                _named: "TripIsNotPriced",
            };
        }
    };
};
