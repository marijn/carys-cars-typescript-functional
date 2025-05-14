import {describe, test} from "@jest/globals";
import {CommandHandlingScenario} from "../../Infrastructure/Decider/Testing/CommandHandlingScenario";
import {runAssertionOnDecider} from "../../Infrastructure/Decider/Testing/runAssertionOnDecider";
import {LocalDateTime, ZonedDateTime, ZoneId} from "js-joda";
import {AnyReservingCommand, AnyReservingEvent, vehicleDecider} from "./VehicleDecider";
import {aVehicleEnteredOperation, aVehicleWasReserved} from "./TestingMessages";

describe('Please reserve vehicle', () => {
    const scenario = new CommandHandlingScenario<AnyReservingEvent, AnyReservingCommand>()

    test('Vehicle is available', async () => {
        return scenario
            .given(
                aVehicleEnteredOperation()
                    .with('vehicle', 'NL:GHC-12-A')
                    .andWith('vehicleClass', 'long distance trips')
                    .toObject()
            )
            .when({
                _named: "Please reserve vehicle!",
                vehicle: 'NL:GHC-12-A',
                reservedBy: "customer:11111111-1111-1111-1111-111111111111",
                when: ZonedDateTime.of(
                    LocalDateTime.parse("2024-11-02T20:19:52"),
                    ZoneId.of("UTC+2")
                )
            })
            .then({
                _named: "Vehicle was reserved",
                vehicle: 'NL:GHC-12-A',
                vehicleClass: 'long distance trips',
                reservedBy: "customer:11111111-1111-1111-1111-111111111111",
                when: ZonedDateTime.of(
                    LocalDateTime.parse("2024-11-02T20:19:52"),
                    ZoneId.of("UTC+2")
                )
            })
            .assertScenario(runAssertionOnDecider(vehicleDecider));
    });

    test('Vehicle is reserved', async () => {
        return scenario
            .given(
                aVehicleEnteredOperation()
                    .with('vehicle', 'NL:GHC-12-A')
                    .andWith('vehicleClass', 'long distance trips')
                    .toObject(),
                aVehicleWasReserved()
                    .with('vehicle', 'NL:GHC-12-A')
                    .andWith('vehicleClass', 'long distance trips')
                    .andWith('reservedBy', 'customer:11111111-1111-1111-1111-111111111111')
                    .toObject(),
            )
            .when({
                _named: "Please reserve vehicle!",
                vehicle: 'NL:GHC-12-A',
                reservedBy: "customer:22222222-2222-2222-2222-222222222222",
                when: ZonedDateTime.of(
                    LocalDateTime.parse("2024-11-02T20:19:53"),
                    ZoneId.of("UTC+2")
                )
            })
            .then({
                _named: "Vehicle could not be reserved",
                vehicle: 'NL:GHC-12-A',
                vehicleClass: "long distance trips",
                interestedCustomer: "customer:22222222-2222-2222-2222-222222222222",
                when: ZonedDateTime.of(
                    LocalDateTime.parse("2024-11-02T20:19:53"),
                    ZoneId.of("UTC+2")
                ),
                reason: "already reserved"
            })
            .assertScenario(runAssertionOnDecider(vehicleDecider));
    });
});
