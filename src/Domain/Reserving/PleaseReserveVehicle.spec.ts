import {describe, test} from "@jest/globals";
import {CommandHandlingScenario} from "../../Infrastructure/Decider/Testing/CommandHandlingScenario";
import {runAssertionOnDecider} from "../../Infrastructure/Decider/Testing/runAssertionOnDecider";
import {LicensePlate} from "../LicensePlate";
import {LocalDateTime, ZonedDateTime, ZoneId} from "js-joda";
import {CustomerId} from "../CustomerId";
import {builderFor} from "../../Infrastructure/Messages/Builder";
import {Decider} from "../../Infrastructure/Decider/Decider";

type VehicleClass =
    | 'in and around the city'
    | 'fun vehicles'
    | 'long distance trips'
    | 'moving bulky things'

type VehicleEnteredOperation = {
    _named: 'Vehicle entered operation',

    /**
     * @example "DE:M-CC-0001"
     */
    vehicle: LicensePlate,

    /**
     * @example "fun vehicles"
     */
    vehicleClass: VehicleClass,

    /**
     * @example 2024-11-02 16:59:01 Europe/Amsterdam
     */
    when: ZonedDateTime
};

export const aVehicleEnteredOperation = builderFor<VehicleEnteredOperation, "Vehicle entered operation">({
    _named: 'Vehicle entered operation',
    vehicle: "DE:M-CC-0001",
    vehicleClass: "fun vehicles",
    when: ZonedDateTime.of(
        LocalDateTime.parse("2024-11-02T16:59:01"),
        ZoneId.of("UTC+2")
    ),
});

type VehicleWasReserved = {
    _named: "Vehicle was reserved",

    /**
     * @example "DE:M-CC-0001"
     */
    vehicle: LicensePlate,

    /**
     * @example "fun vehicles"
     */
    vehicleClass: VehicleClass,

    /**
     * @example "customer:dae3ca24-b1e6-4f0e-85cb-0c4b9f5fab8b"
     */
    reservedBy: CustomerId,

    /**
     * @example 2024-11-02 20:19:52.017351 Europe/Amsterdam
     */
    when: ZonedDateTime
};

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

type ReservationRejectionReason = | "already reserved"
type VehicleCouldNotBeReserved = {
    _named: "Vehicle could not be reserved",

    /**
     * @example "DE:M-CC-0001"
     */
    vehicle: LicensePlate,

    /**
     * @example "fun vehicles"
     */
    vehicleClass: VehicleClass,

    /**
     * @example "customer:dae3ca24-b1e6-4f0e-85cb-0c4b9f5fab8b"
     */
    interestedCustomer: CustomerId,

    /**
     * @example 2024-11-02 20:19:52.017351 Europe/Amsterdam
     */
    when: ZonedDateTime,

    /**
     * @example "already reserved"
     */
    reason: ReservationRejectionReason
};

type PleaseReserveVehicle = {
    _named: "Please reserve vehicle!",

    /**
     * @example DE:M-CC-0001
     */
    vehicle: LicensePlate,

    /**
     * @example customer:dae3ca24-b1e6-4f0e-85cb-0c4b9f5fab8b
     */
    reservedBy: CustomerId,

    /**
     * @example 2024-11-02 20:19:52.017351 Europe/Amsterdam
     */
    when: ZonedDateTime
};

type AnyReservingEvent =
    | VehicleEnteredOperation
    | VehicleCouldNotBeReserved
    | VehicleWasReserved

type AnyReservingCommand =
    | PleaseReserveVehicle

type VehicleIsUnavailable = {
    _named: "Vehicle is unavailable"
}

type VehicleIsAvailable = {
    _named: "Vehicle is available"
    vehicleClass: VehicleClass,
}

type VehicleIsReserved = {
    _named: "Vehicle is reserved",
    vehicleClass: VehicleClass,
    reservedBy: CustomerId
}

type AnyReservingState =
    | VehicleIsUnavailable
    | VehicleIsAvailable
    | VehicleIsReserved

function pleaseReserveVehicle(
    state: AnyReservingState,
    command: AnyReservingCommand
): AnyReservingEvent[] {
    switch (state._named) {
        case "Vehicle is available": {
            return [
                {
                    _named: "Vehicle was reserved",
                    vehicle: command.vehicle,
                    vehicleClass: state.vehicleClass,
                    reservedBy: command.reservedBy,
                    when: command.when,
                }
            ];
        }
        case "Vehicle is reserved": {
            return [
                {
                    _named: "Vehicle could not be reserved",
                    vehicle: command.vehicle,
                    vehicleClass: state.vehicleClass,
                    interestedCustomer: command.reservedBy,
                    when: command.when,
                    reason: "already reserved"
                }
            ];
        }
        default: {
            return [];
        }
    }
}

const decider: Decider<AnyReservingCommand, AnyReservingState, AnyReservingEvent, LicensePlate> = {
    async decide(command: AnyReservingCommand, state: AnyReservingState): Promise<AnyReservingEvent[]> {
        switch (command._named) {
            case "Please reserve vehicle!": {
                return pleaseReserveVehicle(state, command);
            }
        }
    },
    evolve(state: AnyReservingState, event: AnyReservingEvent): AnyReservingState {
        switch (event._named) {
            case "Vehicle entered operation":
                return {_named: "Vehicle is available", vehicleClass: event.vehicleClass}
            case "Vehicle was reserved":
                return {_named: "Vehicle is reserved", reservedBy: event.reservedBy, vehicleClass: event.vehicleClass}
            default:
                return state;
        }
    },
    identify(command: AnyReservingCommand): LicensePlate {
        throw new Error('TODO: Implement me');
    },
    initialState(): AnyReservingState {
        return {
            _named: "Vehicle is unavailable",
        };
    }
};

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
            .assertScenario(runAssertionOnDecider(decider));
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
            .assertScenario(runAssertionOnDecider(decider));
    });
});
