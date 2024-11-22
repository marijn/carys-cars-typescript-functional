import {calculateDistanceTraveled, DistanceTraveled} from "../Rental/DistanceTraveled";
import {DurationOfTrip, durationOfTripToTotalMinutes} from "./DurationOfTrip";
import Dinero from "dinero.js";

export type PricingPolicy = (tripDistance: DistanceTraveled, tripDuration: DurationOfTrip) => Dinero.Dinero;

export const launchingPricing: PricingPolicy = (
    tripDistance,
    tripDuration
) => {
    const pricePerMinute = Dinero({amount: 25, currency: "EUR", precision: 2});
    const allowedDistance: DistanceTraveled = "250.0 km";
    const exceededOrRemaining = calculateDistanceTraveled(tripDistance, allowedDistance);
    const multiplier = Math.floor(Math.abs(parseFloat(exceededOrRemaining)));

    const additionalDistanceCharge = exceededOrRemaining.startsWith('-')
        ? Dinero({amount: 11, currency: "EUR", precision: 2}).multiply(multiplier)
        : Dinero({amount: 0, currency: "EUR", precision: 2});

    return pricePerMinute.multiply(durationOfTripToTotalMinutes(tripDuration)).add(additionalDistanceCharge);
};
