import {describe, expect, it} from "@jest/globals";
import Dinero from "dinero.js";
import {DistanceTraveled} from "../Rental/DistanceTraveled";
import {DurationOfTrip, durationOfTripFromString} from "./DurationOfTrip";
import {launchingPricing} from "./LaunchingPricing";

describe('Pricing', () => {
    describe('Launching Pricing', () => {
        const examples: [DistanceTraveled, DurationOfTrip, Dinero.Dinero][] = [
            ['19.0 km', durationOfTripFromString('00d 00h 17m'), Dinero({amount: 425, currency: "EUR", precision: 2})],
            ['0.0 km', durationOfTripFromString('00d 00h 17m'), Dinero({amount: 425, currency: "EUR", precision: 2})],
            ['121.6 km', durationOfTripFromString('00d 03h 03m'), Dinero({amount: 4575, currency: "EUR", precision: 2})],
            ['199.1 km', durationOfTripFromString('01d 00h 09m'), Dinero({amount: 36225, currency: "EUR", precision: 2})],
            ['301.4 km', durationOfTripFromString('00d 03h 53m'), Dinero({amount: 6386, currency: "EUR", precision: 2})],
        ];

        it.each(examples)("Short trip (trip distance = %s, trip duration = %s, total price = %s)", (
            tripDistance: DistanceTraveled,
            tripDuration: DurationOfTrip,
            totalTripPrice: Dinero.Dinero
        ) => {
            const actual: Dinero.Dinero = launchingPricing(tripDistance, tripDuration);

            const expected: Dinero.Dinero = totalTripPrice;
            expect(actual.toObject()).toEqual(expected.toObject());
        });
    });
});
