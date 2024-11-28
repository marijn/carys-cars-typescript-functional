import {describe, it} from "@jest/globals";
import {QueryHandlingScenario} from "../../Infrastructure/Projector/Testing/QueryHandlingScenario";
import Dinero from "dinero.js";
import {durationOfTripFromString} from "../Pricing/DurationOfTrip";
import {LocalDateTime, ZonedDateTime, ZoneId} from "js-joda";
import {runAssertionsOnProjector} from "../../Infrastructure/Projector/Testing/runAssertionsOnProjector";
import {
    ReportOfMonthlyExpenditureAnswers,
    ReportOfMonthlyExpenditureEvents,
    ReportOfMonthlyExpenditureProjector,
    ReportOfMonthlyExpenditureQueries
} from "./ReportOfMonthlyExpenditure";
import {inMemoryReportOfMonthlyExpenditureProjector} from "./InMemoryReportOfMonthlyExpenditureProjector";
import {aRentalEnded} from "../Rental/Ending/TestingMessages";
import {aPriceOfTripWasCalculated} from "../Pricing/TestingMessages";

const testReportOfMonthlyExpenditureProjector: (subjectUnderTest: () => ReportOfMonthlyExpenditureProjector) => void = (subjectUnderTest) => {
    const scenario = new QueryHandlingScenario<
        ReportOfMonthlyExpenditureEvents,
        ReportOfMonthlyExpenditureQueries,
        ReportOfMonthlyExpenditureAnswers
    >();

    describe('Get report of monthly expenditure by customer', () => {
        it('When no trips were made', async () => {
            return scenario
                .when({
                    _named: "Get report of monthly expenditure by customer",
                    customerId: "customer:AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA",
                    month: '2020-01'
                })
                .then({
                    _named: "Report of monthly expenditure by customer",
                    customerId: "customer:AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA",
                    month: '2020-01',
                    trips: []
                })
                .assertScenario(runAssertionsOnProjector(subjectUnderTest()));
        });

        it('Single trip', async () => {
            return scenario
                .given(
                    aRentalEnded()
                        .with('agreementId', "agreement:11111111-1111-1111-1111-111111111111")
                        .andWith('vehicle', "NL:GGS-10-N")
                        .andWith('customerId', "customer:AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA")
                        .andWith('odometerStart', "3499.1 km")
                        .andWith('odometerEnd', "3518.3 km")
                        .andWith('rentalStarted', ZonedDateTime.of(
                            LocalDateTime.parse("2024-09-12T10:22"),
                            ZoneId.of("UTC+2")
                        ))
                        .andWith('rentalEnded', ZonedDateTime.of(
                            LocalDateTime.parse("2024-09-12T10:39"),
                            ZoneId.of("UTC+2")
                        ))
                        .andWith('startPosition', '52.35633, 4.83712')
                        .andWith('endPosition', '52.36922, 4.96470')
                        .toObject(),

                    aPriceOfTripWasCalculated()
                        .with('tripId', 'trip:11111111-1111-1111-1111-111111111111')
                        .andWith('vehicle', "NL:GGS-10-N")
                        .andWith('agreementId', "agreement:11111111-1111-1111-1111-111111111111")
                        .andWith('durationOfTrip', durationOfTripFromString("00d 00h 17m"))
                        .andWith('tripDistance', "19.2 km")
                        .andWith("pricePerMinute", Dinero({amount: 25, currency: "EUR", precision: 2}))
                        .andWith("totalPrice", Dinero({amount: 425, currency: "EUR", precision: 2}))
                        .andWith("customerId", "customer:AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA")
                        .toObject()
                )
                .when({
                    _named: "Get report of monthly expenditure by customer",
                    customerId: "customer:AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA",
                    month: '2024-09',
                })
                .then({
                    _named: "Report of monthly expenditure by customer",
                    customerId: "customer:AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA",
                    month: '2024-09',
                    trips: [
                        {
                            tripId: "trip:11111111-1111-1111-1111-111111111111",
                            agreementId: "agreement:11111111-1111-1111-1111-111111111111",
                            vehicle: "NL:GGS-10-N",
                            durationOfTrip: durationOfTripFromString("00d 00h 17m"),
                            tripDistance: "19.2 km",
                            odometerStart: '3499.1 km',
                            odometerEnd: '3518.3 km',
                            rentalStarted: ZonedDateTime.of(
                                LocalDateTime.parse("2024-09-12T10:22"),
                                ZoneId.of("UTC+2")
                            ),
                            rentalEnded: ZonedDateTime.of(
                                LocalDateTime.parse("2024-09-12T10:39"),
                                ZoneId.of("UTC+2")
                            ),
                            startPosition: '52.35633, 4.83712',
                            endPosition: '52.36922, 4.96470',
                            totalPrice: Dinero({amount: 425, currency: "EUR", precision: 2}),
                        },
                    ]
                })
                .assertScenario(runAssertionsOnProjector(subjectUnderTest()));
        });

        it('Multiple trips spanning different months', async () => {
            return scenario
                .given(
                    aRentalEnded()
                        .with('agreementId', "agreement:11111111-1111-1111-1111-111111111111")
                        .andWith('vehicle', "NL:GGS-10-N")
                        .andWith('customerId', "customer:AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA")
                        .andWith('odometerStart', "3499.1 km")
                        .andWith('odometerEnd', "3518.3 km")
                        .andWith('rentalStarted', ZonedDateTime.of(
                            LocalDateTime.parse("2024-09-12T10:22"),
                            ZoneId.of("UTC+2")
                        ))
                        .andWith('rentalEnded', ZonedDateTime.of(
                            LocalDateTime.parse("2024-09-12T10:39"),
                            ZoneId.of("UTC+2")
                        ))
                        .andWith('startPosition', '52.35633, 4.83712')
                        .andWith('endPosition', '52.36922, 4.96470')
                        .toObject(),

                    aPriceOfTripWasCalculated()
                        .with('tripId', 'trip:11111111-1111-1111-1111-111111111111')
                        .andWith('vehicle', "NL:GGS-10-N")
                        .andWith('agreementId', "agreement:11111111-1111-1111-1111-111111111111")
                        .andWith('durationOfTrip', durationOfTripFromString("00d 00h 17m"))
                        .andWith('tripDistance', "19.2 km")
                        .andWith("pricePerMinute", Dinero({amount: 25, currency: "EUR", precision: 2}))
                        .andWith("totalPrice", Dinero({amount: 425, currency: "EUR", precision: 2}))
                        .andWith("customerId", "customer:AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA")
                        .toObject(),

                    aRentalEnded()
                        .with('agreementId', "agreement:22222222-2222-2222-2222-222222222222")
                        .andWith('vehicle', "NL:GGD-15-D")
                        .andWith('customerId', "customer:AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA")
                        .andWith('odometerStart', "1298.7 km")
                        .andWith('odometerEnd', "1311.1 km")
                        .andWith('rentalStarted', ZonedDateTime.of(
                            LocalDateTime.parse("2024-09-23T21:59"),
                            ZoneId.of("UTC+2")
                        ))
                        .andWith('rentalEnded', ZonedDateTime.of(
                            LocalDateTime.parse("2024-09-23T22:13"),
                            ZoneId.of("UTC+2")
                        ))
                        .andWith('startPosition', '52.35410, 4.83591')
                        .andWith('endPosition', '52.33917, 4.91529')
                        .toObject(),

                    aPriceOfTripWasCalculated()
                        .with('tripId', 'trip:22222222-2222-2222-2222-222222222222')
                        .andWith('vehicle', "NL:GGD-15-D")
                        .andWith('agreementId', "agreement:22222222-2222-2222-2222-222222222222")
                        .andWith('durationOfTrip', durationOfTripFromString("00d 00h 14m"))
                        .andWith('tripDistance', "12.4 km")
                        .andWith("pricePerMinute", Dinero({amount: 25, currency: "EUR", precision: 2}))
                        .andWith("totalPrice", Dinero({amount: 350, currency: "EUR", precision: 2}))
                        .andWith("customerId", "customer:AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA")
                        .toObject(),

                    aRentalEnded()
                        .with('agreementId', "agreement:33333333-3333-3333-3333-333333333333")
                        .andWith('vehicle', "NL:GGR-50-D")
                        .andWith('customerId', "customer:AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA")
                        .andWith('odometerStart', "5731.9 km")
                        .andWith('odometerEnd', "5869.2 km")
                        .andWith('rentalStarted', ZonedDateTime.of(
                            LocalDateTime.parse("2024-10-01T07:03"),
                            ZoneId.of("UTC+2")
                        ))
                        .andWith('rentalEnded', ZonedDateTime.of(
                            LocalDateTime.parse("2024-10-01T09:32"),
                            ZoneId.of("UTC+2")
                        ))
                        .andWith('startPosition', '52.34773, 4.87809')
                        .andWith('endPosition', '52.34900, 4.87596')
                        .toObject(),


                    aPriceOfTripWasCalculated()
                        .with('tripId', 'trip:33333333-3333-3333-3333-333333333333')
                        .andWith('vehicle', "NL:GGR-50-D")
                        .andWith('agreementId', "agreement:33333333-3333-3333-3333-333333333333")
                        .andWith('durationOfTrip', durationOfTripFromString("00d 02h 29m"))
                        .andWith('tripDistance', "137.3 km")
                        .andWith("pricePerMinute", Dinero({amount: 25, currency: "EUR", precision: 2}))
                        .andWith("totalPrice", Dinero({amount: 3725, currency: "EUR", precision: 2}))
                        .andWith("customerId", "customer:AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA")
                        .toObject()
                )
                .when({
                    _named: "Get report of monthly expenditure by customer",
                    customerId: "customer:AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA",
                    month: '2024-09',
                })
                .then({
                    _named: "Report of monthly expenditure by customer",
                    customerId: "customer:AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA",
                    month: '2024-09',
                    trips: [
                        {
                            tripId: "trip:11111111-1111-1111-1111-111111111111",
                            agreementId: "agreement:11111111-1111-1111-1111-111111111111",
                            vehicle: "NL:GGS-10-N",
                            durationOfTrip: durationOfTripFromString("00d 00h 17m"),
                            tripDistance: "19.2 km",
                            odometerStart: '3499.1 km',
                            odometerEnd: '3518.3 km',
                            rentalStarted: ZonedDateTime.of(
                                LocalDateTime.parse("2024-09-12T10:22"),
                                ZoneId.of("UTC+2")
                            ),
                            rentalEnded: ZonedDateTime.of(
                                LocalDateTime.parse("2024-09-12T10:39"),
                                ZoneId.of("UTC+2")
                            ),
                            startPosition: '52.35633, 4.83712',
                            endPosition: '52.36922, 4.96470',
                            totalPrice: Dinero({amount: 425, currency: "EUR", precision: 2}),
                        },
                        {
                            tripId: "trip:22222222-2222-2222-2222-222222222222",
                            agreementId: "agreement:22222222-2222-2222-2222-222222222222",
                            vehicle: "NL:GGD-15-D",
                            durationOfTrip: durationOfTripFromString("00d 00h 14m"),
                            tripDistance: "12.4 km",
                            odometerStart: '1298.7 km',
                            odometerEnd: '1311.1 km',
                            rentalStarted: ZonedDateTime.of(
                                LocalDateTime.parse("2024-09-23T21:59"),
                                ZoneId.of("UTC+2")
                            ),
                            rentalEnded: ZonedDateTime.of(
                                LocalDateTime.parse("2024-09-23T22:13"),
                                ZoneId.of("UTC+2")
                            ),
                            startPosition: '52.35410, 4.83591',
                            endPosition: '52.33917, 4.91529',
                            totalPrice: Dinero({amount: 350, currency: "EUR", precision: 2}),
                        },
                    ]
                })
                .assertScenario(runAssertionsOnProjector(subjectUnderTest()));
        });
    });
};

describe(
    'Report of monthly expenditure projector (In-memory)',
    () => testReportOfMonthlyExpenditureProjector(inMemoryReportOfMonthlyExpenditureProjector)
);
