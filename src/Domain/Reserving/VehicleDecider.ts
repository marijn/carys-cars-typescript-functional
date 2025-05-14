import {LicensePlate} from "../LicensePlate";
import {CustomerId} from "../CustomerId";
import {ZonedDateTime} from "js-joda";
import {Decider} from "../../Infrastructure/Decider/Decider";
import {VehicleClass} from "./VehicleClass";

export type VehicleEnteredOperation = Readonly<{
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
}>;
export type VehicleWasReserved = Readonly<{
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
}>;
type ReservationRejectionReason = | "already reserved"
type VehicleCouldNotBeReserved = Readonly<{
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
}>;
type PleaseReserveVehicle = Readonly<{
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
}>;
export type AnyReservingEvent =
    | VehicleEnteredOperation
    | VehicleCouldNotBeReserved
    | VehicleWasReserved
export type AnyReservingCommand =
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
const decideToReserveVehicle = (command: AnyReservingCommand, state: VehicleIsAvailable): AnyReservingEvent[] => [
    {
        _named: "Vehicle was reserved",
        vehicle: command.vehicle,
        vehicleClass: state.vehicleClass,
        reservedBy: command.reservedBy,
        when: command.when,
    }
];
const decideNotToReserveVehicle = (command: AnyReservingCommand, state: VehicleIsReserved): AnyReservingEvent[] => [
    {
        _named: "Vehicle could not be reserved",
        vehicle: command.vehicle,
        vehicleClass: state.vehicleClass,
        interestedCustomer: command.reservedBy,
        when: command.when,
        reason: "already reserved"
    }
];
const decideToDoNothing = (): AnyReservingEvent[] => [];
const pleaseReserveVehicle: (command: AnyReservingCommand, state: AnyReservingState) => AnyReservingEvent[] = (command, state) => {
    switch (state._named) {
        case "Vehicle is available": {
            return decideToReserveVehicle(command, state);
        }
        case "Vehicle is reserved": {
            return decideNotToReserveVehicle(command, state);
        }
        default: {
            return decideToDoNothing();
        }
    }
};
const evolveOnVehicleEnteredOperation = (state: AnyReservingState, event: VehicleEnteredOperation): AnyReservingState => ({
    _named: "Vehicle is available",
    vehicleClass: event.vehicleClass
});
const evolveOnVehicleWasReserved = (state: AnyReservingState, event: VehicleWasReserved): AnyReservingState => ({
    _named: "Vehicle is reserved",
    reservedBy: event.reservedBy,
    vehicleClass: event.vehicleClass
});
export const vehicleDecider: Decider<AnyReservingCommand, AnyReservingState, AnyReservingEvent, LicensePlate> = {
    async decide(command, state) {
        switch (command._named) {
            case "Please reserve vehicle!": {
                return pleaseReserveVehicle(command, state);
            }
        }
    },
    evolve(state, event) {
        switch (event._named) {
            case "Vehicle entered operation": {
                return evolveOnVehicleEnteredOperation(state, event);
            }
            case "Vehicle was reserved": {
                return evolveOnVehicleWasReserved(state, event);
            }
            default: {
                return state;
            }
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
