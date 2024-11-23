import {calculateDistanceTraveled, DistanceTraveled} from "../Rental/DistanceTraveled";
import {DurationOfTrip, durationOfTripToTotalMinutes} from "./DurationOfTrip";
import Dinero from "dinero.js";

export type PricingPolicy = (tripDistance: DistanceTraveled, tripDuration: DurationOfTrip) => Dinero.Dinero;

export const flatFeePricingWith: (
    pricePerMinute: Dinero.Dinero,
    pricePerAdditionalKilometer: Dinero.Dinero,
    includedDistance: DistanceTraveled
) => PricingPolicy = (pricePerMinute, pricePerAdditionalKilometer, includedDistance) => {
    return (tripDistance, tripDuration) => {
        const exceededOrRemaining = calculateDistanceTraveled(tripDistance, includedDistance);
        const multiplier = Math.floor(Math.abs(parseFloat(exceededOrRemaining)));
        const additionalDistanceCharge = exceededOrRemaining.startsWith('-')
            ? pricePerAdditionalKilometer.multiply(multiplier)
            : Dinero({amount: 0, currency: "EUR", precision: 2});

        return pricePerMinute.multiply(durationOfTripToTotalMinutes(tripDuration)).add(additionalDistanceCharge);
    }
};

export const launchingPricing: PricingPolicy = flatFeePricingWith(
    Dinero({amount: 25, currency: "EUR", precision: 2}),
    Dinero({amount: 11, currency: "EUR", precision: 2}),
    "250.0 km"
);
