import {builderFor} from "../../Infrastructure/Messages/Builder";
import {PriceOfTripWasCalculated} from "./PriceOfTripWasCalculated";
import {durationOfTripFromString} from "./DurationOfTrip";
import Dinero from "dinero.js";

export const aPriceOfTripWasCalculated = builderFor<PriceOfTripWasCalculated, "Price of trip was calculated">({
    _named: "Price of trip was calculated",
    agreementId: 'agreement:71d3db08-4207-4cd7-9588-7d60f26645bc',
    customerId: 'customer:dae3ca24-b1e6-4f0e-85cb-0c4b9f5fab8b',
    vehicle: 'NL:GGS-20-N',
    durationOfTrip: durationOfTripFromString('00d 01h 04m'),
    pricePerMinute: Dinero({amount: 35, currency: "EUR", precision: 2}),
    totalPrice: Dinero({amount: 2240, currency: "EUR", precision: 2}),
    tripDistance: '56.1 km',
    tripId: 'trip:71d3db08-4207-4cd7-9588-7d60f26645bc'
});
