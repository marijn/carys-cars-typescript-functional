import {DurationOfTrip} from "./DurationOfTrip";
import {DistanceTraveled} from "../Rental/DistanceTraveled";
import {AgreementId} from "../Rental/AgreementId";
import {LicensePlate} from "../LicensePlate";
import {CustomerId} from "../CustomerId";

export type PleaseCalculatePriceOfTrip = Readonly<{
    _named: "Please calculate price of trip",
    tripId: TripId,
    vehicle: LicensePlate,
    durationOfTrip: DurationOfTrip,
    tripDistance: DistanceTraveled,
    customerId: CustomerId,
    agreementId: AgreementId
}>;
