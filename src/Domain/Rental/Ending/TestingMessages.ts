
import {RentalEnded} from "./RentalEnded";
import {builderFor} from "../../../Infrastructure/Messages/Builder";
import {LocalDateTime, ZonedDateTime, ZoneId} from "js-joda";

export const buildRentalEnded = builderFor<RentalEnded, "Rental ended">({
    _named: "Rental ended",
    agreementId: 'agreement:7f6de6a3-90b5-4ba0-bb6a-297d7c9f2a61',
    customerId: 'customer:dae3ca24-b1e6-4f0e-85cb-0c4b9f5fab8b',
    vehicle: 'NL:GGS-21-N',
    odometerStart: "300.6 km",
    odometerEnd: "370.2 km",
    rentalStarted: ZonedDateTime.of(
        LocalDateTime.parse("2024-11-02T15:03"),
        ZoneId.of("UTC+2")
    ),
    rentalEnded: ZonedDateTime.of(
        LocalDateTime.parse("2024-11-02T16:59"),
        ZoneId.of("UTC+2")
    ),
    startPosition: "52.38029, 4.87608",
    endPosition: "52.36006, 4.93716",
});
