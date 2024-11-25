import {AgreementId} from "../AgreementId";
import {DistanceTraveled} from "../DistanceTraveled";
import {ZonedDateTime} from "js-joda";
import {LatitudeLongitude} from "../LatitudeLongitude";
import {LicensePlate} from "../../LicensePlate";
import {CustomerId} from "../../CustomerId";

export type RentalEnded = Readonly<{
    _named: "Rental ended",
    agreementId: AgreementId,
    vehicle: LicensePlate,
    customerId: CustomerId,
    odometerStart: DistanceTraveled,
    odometerEnd: DistanceTraveled,
    rentalStarted: ZonedDateTime,
    rentalEnded: ZonedDateTime,
    startPosition: LatitudeLongitude,
    endPosition: LatitudeLongitude,
}>;
