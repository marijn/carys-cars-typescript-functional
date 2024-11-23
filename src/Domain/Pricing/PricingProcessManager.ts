import {PleaseCalculatePriceOfTrip} from "./PleaseCalculatePriceOfTrip";
import {agreementIdToTripId} from "../Rental/AgreementId";
import {durationOfTripFromStartAndEnd} from "./DurationOfTrip";
import {calculateDistanceTraveled} from "../Rental/DistanceTraveled";
import {RentalEnded} from "../Rental/Ending/RentalEnded";
import {ProcessManager} from "../../Infrastructure/ProcessManager/ProcessManager";

export type PricingProcessManagerTriggers = | RentalEnded;
export type PricingProcessManagerSideEffects = | PleaseCalculatePriceOfTrip;
export type PricingProcessManager = ProcessManager<
    PricingProcessManagerTriggers,
    PricingProcessManagerSideEffects
>;
export const buildPricingProcessManager: () => PricingProcessManager = () => {
    return {
        async processEvent(event: PricingProcessManagerTriggers): Promise<PricingProcessManagerSideEffects[]> {
            return [
                {
                    _named: "Please calculate price of trip",
                    tripId: agreementIdToTripId(event.agreementId),
                    vehicle: event.vehicle,
                    agreementId: event.agreementId,
                    durationOfTrip: durationOfTripFromStartAndEnd(event.rentalStarted, event.rentalEnded),
                    tripDistance: calculateDistanceTraveled(event.odometerStart, event.odometerEnd),
                    customerId: event.customerId,
                }
            ]
        },
        subscribesTo: [],
    }
};
