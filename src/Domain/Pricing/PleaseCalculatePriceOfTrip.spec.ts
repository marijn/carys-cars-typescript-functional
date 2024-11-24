import {describe, it} from "@jest/globals";
import {CommandHandlingScenario} from "../../Infrastructure/Decider/Testing/CommandHandlingScenario";
import {durationOfTripFromString} from "./DurationOfTrip";
import Dinero from "dinero.js";
import {runAssertionOnDecider} from "../../Infrastructure/Decider/Testing/runAssertionOnDecider";
import {launchingPricing} from "./LaunchingPricing";
import {buildPricingDecider, PricingCommands, PricingEvents} from "./PricingDecider";

describe('Please calculate price of trip', () => {
    const scenario = new CommandHandlingScenario<PricingEvents, PricingCommands>()

    it('Trip is NOT priced', async () => {
        const pricingDecider = buildPricingDecider(launchingPricing);

        return scenario
            .when({
                _named: "Please calculate price of trip",
                tripId: "trip:11111111-1111-1111-1111-111111111111",
                vehicle: "NL:GGS-10-N",
                agreementId: "agreement:11111111-1111-1111-1111-111111111111",
                durationOfTrip: durationOfTripFromString("00d 00h 17m"),
                tripDistance: "19.0 km",
                customerId: "customer:AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA",
            })
            .then({
                _named: "Price of trip was calculated",
                tripId: "trip:11111111-1111-1111-1111-111111111111",
                vehicle: "NL:GGS-10-N",
                agreementId: "agreement:11111111-1111-1111-1111-111111111111",
                durationOfTrip: durationOfTripFromString("00d 00h 17m"),
                tripDistance: "19.0 km",
                pricePerMinute: Dinero({amount: 25, currency: "EUR", precision: 2}),
                totalPrice: Dinero({amount: 425, currency: "EUR", precision: 2}),
                customerId: "customer:AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA",
            })
            .assertScenario(runAssertionOnDecider(pricingDecider));
    });

    it('is ignored when nothing changed', async () => {
        const pricingDecider = buildPricingDecider(launchingPricing);

        return scenario
            .given({
                _named: "Price of trip was calculated",
                tripId: "trip:11111111-1111-1111-1111-111111111111",
                vehicle: "NL:GGS-10-N",
                agreementId: "agreement:11111111-1111-1111-1111-111111111111",
                durationOfTrip: durationOfTripFromString("00d 00h 17m"),
                tripDistance: "19.0 km",
                pricePerMinute: Dinero({amount: 25, currency: "EUR", precision: 2}),
                totalPrice: Dinero({amount: 425, currency: "EUR", precision: 2}),
                customerId: "customer:AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA",
            })
            .when({
                _named: "Please calculate price of trip",
                tripId: "trip:11111111-1111-1111-1111-111111111111",
                vehicle: "NL:GGS-10-N",
                agreementId: "agreement:11111111-1111-1111-1111-111111111111",
                durationOfTrip: durationOfTripFromString("00d 00h 17m"),
                tripDistance: "19.0 km",
                customerId: "customer:AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA",
            })
            .thenNothingShouldHaveHappened()
            .assertScenario(runAssertionOnDecider(pricingDecider));
    });
});
