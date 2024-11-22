import {describe, expect, it} from "@jest/globals";
import Dinero from "dinero.js";
import {DistanceTraveled} from "../Rental/DistanceTraveled";
import {DurationOfTrip, durationOfTripFromString} from "./DurationOfTrip";

const launchingPricing: (tripDistance: DistanceTraveled, tripDuration: DurationOfTrip) => Dinero.Dinero = (tripDistance, tripDuration) => {
    throw new Error('TODO: Implement me');
};

describe('Pricing', () => {
    describe('Launching Pricing', () => {
        it("Short trip", () => {
            const tripDistance: DistanceTraveled = '19.0 km';
            const tripDuration: DurationOfTrip = durationOfTripFromString('00d 00h 17m');
            const actual: Dinero.Dinero = launchingPricing(tripDistance, tripDuration);

            const expected: Dinero.Dinero = Dinero({amount: 595, currency: "EUR", precision: 2});
            expect(actual.toObject()).toEqual(expected.toObject());
        });
    });
});
