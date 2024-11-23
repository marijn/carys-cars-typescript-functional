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

const scenario = new QueryHandlingScenario<
    ReportOfMonthlyExpenditureEvents,
    ReportOfMonthlyExpenditureQueries,
    ReportOfMonthlyExpenditureAnswers
>();

const testReportOfMonthlyExpenditureProjector: (subjectUnderTest: () => ReportOfMonthlyExpenditureProjector) => void = (subjectUnderTest) => {
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
                .given({
                        _named: "Rental ended",
                        agreementId: "agreement:11111111-1111-1111-1111-111111111111",
                        vehicle: "NL:GGS-10-N",
                        customerId: "customer:AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA",
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
                    },
                    {
                        _named: "Price of trip was calculated",
                        tripId: "trip:11111111-1111-1111-1111-111111111111",
                        vehicle: "NL:GGS-10-N",
                        agreementId: "agreement:11111111-1111-1111-1111-111111111111",
                        durationOfTrip: durationOfTripFromString("00d 00h 17m"),
                        tripDistance: "19.2 km",
                        pricePerMinute: Dinero({amount: 25, currency: "EUR", precision: 2}),
                        totalPrice: Dinero({amount: 425, currency: "EUR", precision: 2}),
                        customerId: "customer:AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA",
                    })
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
                .given({
                        _named: "Rental ended",
                        agreementId: "agreement:11111111-1111-1111-1111-111111111111",
                        vehicle: "NL:GGS-10-N",
                        customerId: "customer:AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA",
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
                    },
                    {
                        _named: "Price of trip was calculated",
                        tripId: "trip:11111111-1111-1111-1111-111111111111",
                        vehicle: "NL:GGS-10-N",
                        agreementId: "agreement:11111111-1111-1111-1111-111111111111",
                        durationOfTrip: durationOfTripFromString("00d 00h 17m"),
                        tripDistance: "19.2 km",
                        pricePerMinute: Dinero({amount: 25, currency: "EUR", precision: 2}),
                        totalPrice: Dinero({amount: 425, currency: "EUR", precision: 2}),
                        customerId: "customer:AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA",
                    },
                    {
                        _named: "Rental ended",
                        agreementId: "agreement:22222222-2222-2222-2222-222222222222",
                        vehicle: "NL:GGD-15-D",
                        customerId: "customer:AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA",
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
                    },
                    {
                        _named: "Price of trip was calculated",
                        tripId: "trip:22222222-2222-2222-2222-222222222222",
                        vehicle: "NL:GGD-15-D",
                        agreementId: "agreement:22222222-2222-2222-2222-222222222222",
                        durationOfTrip: durationOfTripFromString("00d 00h 14m"),
                        tripDistance: "12.4 km",
                        pricePerMinute: Dinero({amount: 25, currency: "EUR", precision: 2}),
                        totalPrice: Dinero({amount: 350, currency: "EUR", precision: 2}),
                        customerId: "customer:AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA",
                    },
                    {
                        _named: "Rental ended",
                        agreementId: "agreement:33333333-3333-3333-3333-333333333333",
                        vehicle: "NL:GGR-50-D",
                        customerId: "customer:AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA",
                        odometerStart: '5731.9 km',
                        odometerEnd: '5869.2 km',
                        rentalStarted: ZonedDateTime.of(
                            LocalDateTime.parse("2024-10-01T07:03"),
                            ZoneId.of("UTC+2")
                        ),
                        rentalEnded: ZonedDateTime.of(
                            LocalDateTime.parse("2024-10-01T09:32"),
                            ZoneId.of("UTC+2")
                        ),
                        startPosition: '52.34773, 4.87809',
                        endPosition: '52.34900, 4.87596',
                    },
                    {
                        _named: "Price of trip was calculated",
                        tripId: "trip:33333333-3333-3333-3333-333333333333",
                        vehicle: "NL:GGR-50-D",
                        agreementId: "agreement:33333333-3333-3333-3333-333333333333",
                        durationOfTrip: durationOfTripFromString("00d 02h 29m"),
                        tripDistance: "137.3 km",
                        pricePerMinute: Dinero({amount: 25, currency: "EUR", precision: 2}),
                        totalPrice: Dinero({amount: 3725, currency: "EUR", precision: 2}),
                        customerId: "customer:AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA",
                    },
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
