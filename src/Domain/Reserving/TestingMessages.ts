import {builderFor} from "../../Infrastructure/Messages/Builder";
import {VehicleEnteredOperation, VehicleWasReserved} from "./VehicleDecider";
import {LocalDateTime, ZonedDateTime, ZoneId} from "js-joda";

export const aVehicleEnteredOperation = builderFor<VehicleEnteredOperation, "Vehicle entered operation">({
    _named: 'Vehicle entered operation',
    vehicle: "DE:M-CC-0001",
    vehicleClass: "fun vehicles",
    when: ZonedDateTime.of(
        LocalDateTime.parse("2024-11-02T16:59:01"),
        ZoneId.of("UTC+2")
    ),
});

export const aVehicleWasReserved = builderFor<VehicleWasReserved, "Vehicle was reserved">({
    _named: "Vehicle was reserved",
    vehicle: "DE:M-CC-0001",
    vehicleClass: "fun vehicles",
    reservedBy: "customer:dae3ca24-b1e6-4f0e-85cb-0c4b9f5fab8b",
    when: ZonedDateTime.of(
        LocalDateTime.parse("2024-11-02T20:19:52"),
        ZoneId.of("UTC+2")
    )
});
