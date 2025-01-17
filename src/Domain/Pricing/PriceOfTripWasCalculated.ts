import {DurationOfTrip} from "./DurationOfTrip";
import {DistanceTraveled} from "../Rental/DistanceTraveled";
import {AgreementId} from "../Rental/AgreementId";
import {Dinero} from "dinero.js";
import {TripId} from "./TripId";
import {CustomerId} from "../CustomerId";

export type PriceOfTripWasCalculated = Readonly<{
    _named: "Price of trip was calculated",
    tripId: TripId,
    durationOfTrip: DurationOfTrip,
    tripDistance: DistanceTraveled,
    customerId: CustomerId,
    agreementId: AgreementId
    pricePerMinute: Dinero,
    totalPrice: Dinero
}>;
