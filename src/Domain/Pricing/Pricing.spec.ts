import {describe, expect, it} from "@jest/globals";
import Dinero from "dinero.js";
import {DistanceTraveled} from "../Rental/DistanceTraveled";
import {DurationOfTrip, durationOfTripFromString} from "./DurationOfTrip";

const launchingPricing: (tripDistance: DistanceTraveled, tripDuration: DurationOfTrip) => Dinero.Dinero = (tripDistance, tripDuration) => {
    return Dinero({amount: 595, currency: "EUR", precision: 2});
};

describe('Pricing', () => {
    describe('Launching Pricing', () => {
        const tripDistance: DistanceTraveled = '19.0 km';
        const tripDuration: DurationOfTrip = durationOfTripFromString('00d 00h 17m');
        const totalTripPrice = Dinero({amount: 595, currency: "EUR", precision: 2});

        it("Short trip", () => {
            const actual: Dinero.Dinero = launchingPricing(tripDistance, tripDuration);

            const expected: Dinero.Dinero = totalTripPrice;
            expect(actual.toObject()).toEqual(expected.toObject());
        });
    });
});
