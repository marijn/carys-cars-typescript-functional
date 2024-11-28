import {DurationOfTrip} from "./DurationOfTrip";
import {DistanceTraveled} from "../Rental/DistanceTraveled";
import {AgreementId} from "../Rental/AgreementId";
import {Dinero} from "dinero.js";
import {LicensePlate} from "../LicensePlate";
import {CustomerId} from "../CustomerId";
import {TripId} from "./TripId";

export type PriceOfTripWasCalculated = Readonly<{
    _named: "Price of trip was calculated",
    tripId: TripId,
    vehicle: LicensePlate,
    durationOfTrip: DurationOfTrip,
    tripDistance: DistanceTraveled,
    customerId: CustomerId,
    agreementId: AgreementId
    pricePerMinute: Dinero,
    totalPrice: Dinero
}>;
