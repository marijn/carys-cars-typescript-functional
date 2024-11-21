import {DurationOfTrip} from "./DurationOfTrip";
import {DistanceTraveled} from "../Rental/DistanceTraveled";
import {AgreementId} from "../Rental/AgreementId";

export type PleaseCalculatePriceOfTrip = Readonly<{
    _named: "Please calculate price of trip",
    tripId: TripId,
    durationOfTrip: DurationOfTrip,
    tripDistance: DistanceTraveled,
    customerId: CustomerId,
    agreementId: AgreementId
}>;
