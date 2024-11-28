import {describe, it} from "@jest/globals";
import {ProcessManagerScenario} from "../../Infrastructure/ProcessManager/Testing/ProcessManagerScenario";
import {runAssertionOnProcessManager} from "../../Infrastructure/ProcessManager/Testing/runAssertionOnProcessManager";
import {durationOfTripFromString} from "./DurationOfTrip";
import {LocalDateTime, ZonedDateTime, ZoneId} from "js-joda";
import {
    buildPricingProcessManager,
    PricingProcessManager,
    PricingProcessManagerSideEffects,
    PricingProcessManagerTriggers
} from "./PricingProcessManager";
import {aRentalEnded} from "../Rental/Ending/TestingMessages";

describe('Pricing process manager', () => {
    const scenario = new ProcessManagerScenario<
        PricingProcessManagerTriggers,
        PricingProcessManagerSideEffects
    >();

    it('Rental ended => Please calculate price of trip', async (): Promise<void> => {
        const subjectUnderTest: PricingProcessManager = buildPricingProcessManager();

        return scenario
            .when(
                aRentalEnded()
                    .with('agreementId', 'agreement:11111111-1111-1111-1111-111111111111')
                    .andWith('customerId', 'customer:AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA')
                    .andWith('startPosition', '52.34773, 4.87809')
                    .andWith('endPosition', '52.34900, 4.87596')
                    .andWith('odometerStart', '2024.6 km')
                    .andWith('odometerEnd', '2033.8 km')
                    .andWith('rentalStarted', ZonedDateTime.of(
                        LocalDateTime.parse("2024-08-05T15:08"),
                        ZoneId.of("UTC+2")
                    ))
                    .andWith('rentalEnded', ZonedDateTime.of(
                        LocalDateTime.parse("2024-08-05T15:29"),
                        ZoneId.of("UTC+2")
                    ))
                    .andWith('vehicle', 'NL:GGS-25-N')
                    .toObject()
            )
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
