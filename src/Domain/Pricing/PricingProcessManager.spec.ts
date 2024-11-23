import {describe, it} from "@jest/globals";
import {ProcessManagerScenario} from "../../Infrastructure/ProcessManager/Testing/ProcessManagerScenario";
import {PleaseCalculatePriceOfTrip} from "./PleaseCalculatePriceOfTrip";
import {RentalEnded} from "../Rental/Ending/RentalEnded";
import {runAssertionOnProcessManager} from "../../Infrastructure/ProcessManager/Testing/runAssertionOnProcessManager";
import {ProcessManager} from "../../Infrastructure/ProcessManager/ProcessManager";
import {durationOfTripFromString} from "./DurationOfTrip";
import {LocalDateTime, ZonedDateTime, ZoneId} from "js-joda";
import {calculateDistanceTraveled} from "../Rental/DistanceTraveled";
import {agreementIdToTripId} from "../Rental/AgreementId";

type PricingProcessManagerTriggers = | RentalEnded;
type PricingProcessManagerSideEffects = | PleaseCalculatePriceOfTrip;

describe('Pricing process manager', () => {
    const scenario: ProcessManagerScenario<
        PricingProcessManagerTriggers,
        PricingProcessManagerSideEffects
    > = new ProcessManagerScenario<
        PricingProcessManagerTriggers,
        PricingProcessManagerSideEffects
    >();

    it('Rental ended => Please calculate price of trip', async (): Promise<void> => {
        const subjectUnderTest: ProcessManager<
            PricingProcessManagerTriggers,
            PricingProcessManagerSideEffects
        > = {
            async processEvent(event: PricingProcessManagerTriggers): Promise<PricingProcessManagerSideEffects[]> {
                return [
                    {
                        _named: "Please calculate price of trip",
                        tripId: agreementIdToTripId(event.agreementId),
                        vehicle: event.vehicle,
                        agreementId: event.agreementId,
                        durationOfTrip: durationOfTripFromString("00d 00h 21m"),
                        tripDistance: calculateDistanceTraveled(event.odometerStart, event.odometerEnd),
                        customerId: event.customerId,
                    }
                ]
            },
            subscribesTo: [],
        };

        return scenario
            .when({
                _named: "Rental ended",
                agreementId: "agreement:11111111-1111-1111-1111-111111111111",
                customerId: "customer:AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA",
                startPosition: '52.34773, 4.87809',
                endPosition: '52.34900, 4.87596',
                odometerStart: "2024.6 km",
                odometerEnd: "2033.8 km",
                rentalStarted: ZonedDateTime.of(
                    LocalDateTime.parse("2024-08-05T15:08"),
                    ZoneId.of("UTC+2")
                ),
                rentalEnded: ZonedDateTime.of(
                    LocalDateTime.parse("2024-08-05T15:29"),
                    ZoneId.of("UTC+2")
                ),
                vehicle: "NL:GGS-25-N",
            })
            .then({
                _named: "Please calculate price of trip",
                tripId: "trip:11111111-1111-1111-1111-111111111111",
                vehicle: "NL:GGS-25-N",
                agreementId: "agreement:11111111-1111-1111-1111-111111111111",
                durationOfTrip: durationOfTripFromString("00d 00h 21m"),
                tripDistance: "9.2 km",
                customerId: "customer:AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA",
            })
            .assertScenario(runAssertionOnProcessManager(subjectUnderTest))
    });
});
