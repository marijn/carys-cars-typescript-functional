import {describe, expect, it} from "@jest/globals";
import Dinero from "dinero.js";
import {DistanceTraveled} from "../Rental/DistanceTraveled";
import {DurationOfTrip, durationOfTripFromString, durationOfTripToTotalMinutes} from "./DurationOfTrip";

const launchingPricing: (tripDistance: DistanceTraveled, tripDuration: DurationOfTrip) => Dinero.Dinero = (tripDistance, tripDuration) => {
    const pricePerMinute = Dinero({amount: 35, currency: "EUR", precision: 2});

    return pricePerMinute.multiply(durationOfTripToTotalMinutes(tripDuration));
};

describe('Pricing', () => {
    describe('Launching Pricing', () => {
        const examples: [DistanceTraveled, DurationOfTrip, Dinero.Dinero][] = [
            ['19.0 km', durationOfTripFromString('00d 00h 17m'), Dinero({amount: 595, currency: "EUR", precision: 2})],
            ['0.0 km', durationOfTripFromString('00d 00h 17m'), Dinero({amount: 595, currency: "EUR", precision: 2})],
            ['121.6 km', durationOfTripFromString('00d 03h 03m'), Dinero({amount: 6405, currency: "EUR", precision: 2})],
            ['199.1 km', durationOfTripFromString('01d 00h 09m'), Dinero({amount: 50715, currency: "EUR", precision: 2})],
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
