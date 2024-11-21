import {describe, it} from "@jest/globals";
import {CommandHandlingScenario} from "../../Infrastructure/Decider/Testing/CommandHandlingScenario";
import {PriceOfTripWasCalculated} from "./PriceOfTripWasCalculated";
import {PleaseCalculatePriceOfTrip} from "./PleaseCalculatePriceOfTrip";
import {durationOfTripFromString} from "./DurationOfTrip";
import Dinero from "dinero.js";

type PricingEvents = | PriceOfTripWasCalculated;
type PricingCommands = | PleaseCalculatePriceOfTrip;

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
            });
    });
});
