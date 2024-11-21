import {describe, it} from "@jest/globals";
import {CommandHandlingScenario} from "../../Infrastructure/Decider/Testing/CommandHandlingScenario";
import {PriceOfTripWasCalculated} from "./PriceOfTripWasCalculated";
import {PleaseCalculatePriceOfTrip} from "./PleaseCalculatePriceOfTrip";
import {durationOfTripFromString} from "./DurationOfTrip";
import Dinero from "dinero.js";
import {runAssertionOnDecider} from "../../Infrastructure/Decider/Testing/runAssertionOnDecider";
import {Decider} from "../../Infrastructure/Decider/Decider";

type PricingEvents = | PriceOfTripWasCalculated;
type PricingCommands = | PleaseCalculatePriceOfTrip;
type PricingStates = {}

const decider: Decider<PricingCommands, PricingStates, PricingEvents, TripId> = {
    decide(command: PricingCommands, state: PricingStates): Promise<PricingEvents[]> {
        switch (command._named) {
            case "Please calculate price of trip": {
                return Promise.resolve([
                    {
                        _named: "Price of trip was calculated",
                        tripId: "trip:11111111-1111-1111-1111-111111111111",
                        agreementId: "agreement:11111111-1111-1111-1111-111111111111",
                        durationOfTrip: durationOfTripFromString("00d 00h 17m"),
                        tripDistance: "19.0 km",
                        pricePerMinute: Dinero({amount: 35, currency: "EUR", precision: 2}),
                        totalPrice: Dinero({amount: 490, currency: "EUR", precision: 2}),
                        customerId: "customer:AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA",
                    }
                ]);
            }
        }
    },
    evolve(state: PricingStates, event: PricingEvents): PricingStates {
        return state;
    },
    identify(command: PricingCommands): TripId {
        throw new Error('TODO: Implement me');
    },
    initialState(): PricingStates {
        return {};
    }
};

describe('Please calculate price of trip', () => {
    const scenario = new CommandHandlingScenario<PricingEvents, PricingCommands>()

    it('Happy path :-)', async () => {
        return scenario
            .when({
                _named: "Please calculate price of trip",
                tripId: "trip:11111111-1111-1111-1111-111111111111",
                agreementId: "agreement:11111111-1111-1111-1111-111111111111",
                durationOfTrip: durationOfTripFromString("00d 00h 17m"),
                tripDistance: "19.0 km",
                customerId: "customer:AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA",
            })
            .then({
                _named: "Price of trip was calculated",
                tripId: "trip:11111111-1111-1111-1111-111111111111",
                agreementId: "agreement:11111111-1111-1111-1111-111111111111",
                durationOfTrip: durationOfTripFromString("00d 00h 17m"),
                tripDistance: "19.0 km",
                pricePerMinute: Dinero({amount: 35, currency: "EUR", precision: 2}),
                totalPrice: Dinero({amount: 490, currency: "EUR", precision: 2}),
                customerId: "customer:AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA",
            })
            .assertScenario(runAssertionOnDecider(decider));
    });
});
