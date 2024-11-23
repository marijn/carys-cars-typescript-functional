import {describe, it} from "@jest/globals";
import {QueryHandlingScenario} from "../../Infrastructure/Projector/Testing/QueryHandlingScenario";
import Dinero from "dinero.js";
import {AgreementId} from "../Rental/AgreementId";
import {LicensePlate} from "../LicensePlate";
import {DurationOfTrip, durationOfTripFromString} from "../Pricing/DurationOfTrip";
import {DistanceTraveled} from "../Rental/DistanceTraveled";
import {LocalDateTime, ZonedDateTime, ZoneId} from "js-joda";
import {LatitudeLongitude} from "../Rental/LatitudeLongitude";
import {runAssertionsOnProjector} from "../../Infrastructure/Projector/Testing/runAssertionsOnProjector";
import {Projector} from "../../Infrastructure/Projector/Projector";
import {RentalEnded} from "../Rental/Ending/RentalEnded";
import {PriceOfTripWasCalculated} from "../Pricing/PriceOfTripWasCalculated";

type AllMonths = | '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09' | '10' | '11' | '12';
type AllYears = `20${'2' | '3' | '4'}${'1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '0'}`
type ReportingMonth<
    ReportingYear extends AllYears = AllYears,
    ReportingMonth extends AllMonths = AllMonths
> = `${ReportingYear}-${ReportingMonth}`

type GetReportOfMonthlyExpenditureByCustomer = {
    _named: 'Get report of monthly expenditure by customer',
    customerId: CustomerId,
    month: ReportingMonth,
};

type Trip = {
    tripId: TripId,
    agreementId: AgreementId,
    vehicle: LicensePlate,
    durationOfTrip: DurationOfTrip,
    tripDistance: DistanceTraveled,
    odometerStart: DistanceTraveled,
    odometerEnd: DistanceTraveled,
    rentalStarted: ZonedDateTime,
    rentalEnded: ZonedDateTime,
    startPosition: LatitudeLongitude,
    endPosition: LatitudeLongitude,
    totalPrice: Dinero.Dinero
};
type ReportOfMonthlyExpenditureByCustomer = {
    _named: 'Report of monthly expenditure by customer',
    customerId: CustomerId,
    month: ReportingMonth,
    trips: Trip[]
};

type ReportOfMonthlyExpenditureEvents =
    | RentalEnded
    | PriceOfTripWasCalculated
type ReportOfMonthlyExpenditureQueries = | GetReportOfMonthlyExpenditureByCustomer
type ReportOfMonthlyExpenditureAnswers = | ReportOfMonthlyExpenditureByCustomer

const scenario = new QueryHandlingScenario<
    ReportOfMonthlyExpenditureEvents,
    ReportOfMonthlyExpenditureQueries,
    ReportOfMonthlyExpenditureAnswers
>();

type EndedRentalAgreement = {
    odometerEnd: DistanceTraveled,
    odometerStart: DistanceTraveled,
    rentalEnded: ZonedDateTime,
    rentalStarted: ZonedDateTime,
    startPosition: LatitudeLongitude,
    endPosition: LatitudeLongitude,
    month: ReportingMonth
}

type ReportOfMonthlyExpenditureProjector = Projector<
    ReportOfMonthlyExpenditureEvents,
    ReportOfMonthlyExpenditureQueries,
    ReportOfMonthlyExpenditureAnswers
>;

const inMemoryReportOfMonthlyExpenditureProjector: () => ReportOfMonthlyExpenditureProjector = () => {
    const agreementsByAgreementId: { [key: AgreementId]: EndedRentalAgreement } = {};
    const tripsByCustomer: { [key: CustomerId]: Partial<Record<ReportingMonth, Trip[]>> } = {};

    return {
        async ask(query: ReportOfMonthlyExpenditureQueries): Promise<ReportOfMonthlyExpenditureAnswers> {
            return {
                _named: "Report of monthly expenditure by customer",
                customerId: query.customerId,
                month: query.month,
                trips: query.customerId in tripsByCustomer
                    ? (query.month in tripsByCustomer[query.customerId] ? tripsByCustomer[query.customerId][query.month]: [])
                    : []
            };
        },
        async when(event: ReportOfMonthlyExpenditureEvents): Promise<void> {
            switch (event._named) {
                case "Rental ended": {
                    agreementsByAgreementId[event.agreementId] = {
                        odometerEnd: event.odometerEnd,
                        odometerStart: event.odometerStart,
                        rentalEnded: event.rentalEnded,
                        rentalStarted: event.rentalStarted,
                        startPosition: event.startPosition,
                        endPosition: event.endPosition,
                        month: `${event.rentalStarted.year() as unknown as AllYears}-${event.rentalStarted.month().value().toString(10).padStart(2, '0') as unknown as AllMonths}`
                    }

                    return;
                }
                case "Price of trip was calculated": {
                    const agreement = agreementsByAgreementId[event.agreementId];

                    if ( ! (event.customerId in tripsByCustomer)) {
                        tripsByCustomer[event.customerId] = {};
                    }

                    if ( ! (agreement.month in tripsByCustomer[event.customerId])) {
                        tripsByCustomer[event.customerId][agreement.month] = [];
                    }

                    tripsByCustomer[event.customerId][agreement.month].push({
                        agreementId: event.agreementId,
                        durationOfTrip: event.durationOfTrip,
                        odometerEnd: agreement.odometerEnd,
                        odometerStart: agreement.odometerStart,
                        rentalEnded: agreement.rentalEnded,
                        rentalStarted: agreement.rentalStarted,
                        startPosition: agreement.startPosition,
                        endPosition: agreement.endPosition,
                        totalPrice: event.totalPrice,
                        tripDistance: event.tripDistance,
                        tripId: event.tripId,
                        vehicle: event.vehicle
                    });

                    return;
                }
            }
        },
        subscribesTo: [],
    };
}

const testReportOfMonthlyExpenditureProjector: (subjectUnderTest: () => ReportOfMonthlyExpenditureProjector) => void = (subjectUnderTest) => {
    describe('Report of monthly expenditure', () => {
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
    });
};

describe(
    'Report of monthly expenditure projector (In-memory)',
    () => testReportOfMonthlyExpenditureProjector(inMemoryReportOfMonthlyExpenditureProjector)
);
