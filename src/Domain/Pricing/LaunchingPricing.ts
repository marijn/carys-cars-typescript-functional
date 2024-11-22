import {DistanceTraveled} from "../Rental/DistanceTraveled";
import {DurationOfTrip, durationOfTripToTotalMinutes} from "./DurationOfTrip";
import Dinero from "dinero.js";

type PricingPolicy = (tripDistance: DistanceTraveled, tripDuration: DurationOfTrip) => Dinero.Dinero;

export const launchingPricing: PricingPolicy = (
    tripDistance,
    tripDuration
) => {
    const pricePerMinute = Dinero({amount: 35, currency: "EUR", precision: 2});

    return pricePerMinute.multiply(durationOfTripToTotalMinutes(tripDuration));
};
