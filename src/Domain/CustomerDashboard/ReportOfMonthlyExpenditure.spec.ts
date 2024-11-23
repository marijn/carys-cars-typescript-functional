import {describe, it} from "@jest/globals";
import {QueryHandlingScenario} from "../../Infrastructure/Projector/Testing/QueryHandlingScenario";
import Dinero from "dinero.js";
import {AgreementId} from "../Rental/AgreementId";
import {LicensePlate} from "../LicensePlate";
import {DurationOfTrip} from "../Pricing/DurationOfTrip";
import {DistanceTraveled} from "../Rental/DistanceTraveled";
import {ZonedDateTime} from "js-joda";
import {LatitudeLongitude} from "../Rental/LatitudeLongitude";
import {runAssertionsOnProjector} from "../../Infrastructure/Projector/Testing/runAssertionsOnProjector";
import {Projector} from "../../Infrastructure/Projector/Projector";
import {RentalEnded} from "../Rental/Ending/RentalEnded";
import {PriceOfTripWasCalculated} from "../Pricing/PriceOfTripWasCalculated";

type AllMonths = | '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09' | '10' | '11' | '12';
type AllYears = `20${ '2' | '3' | '4'}${ '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '0'}`
type ReportingMonth<
    ReportingYear extends AllYears = AllYears,
    ReportingMonth extends AllMonths = AllMonths
> = `${ReportingYear}-${ReportingMonth}`

type GetReportOfMonthlyExpenditureByCustomer = {
    _named: 'Get report of monthly expenditure by customer',
    customerId: CustomerId,
    month: ReportingMonth,
};

type ReportOfMonthlyExpenditureByCustomer = {
    _named: 'Report of monthly expenditure by customer',
    customerId: CustomerId,
    month: ReportingMonth,
    trips: {
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
    }[]
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

const projector: Projector<
    ReportOfMonthlyExpenditureEvents,
    ReportOfMonthlyExpenditureQueries,
    ReportOfMonthlyExpenditureAnswers
> = {
    async ask(query: ReportOfMonthlyExpenditureQueries): Promise<ReportOfMonthlyExpenditureAnswers> {
        return {
            _named: "Report of monthly expenditure by customer",
            customerId: "customer:AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA",
            month: '2020-01',
            trips: []
        };
    },
    async when(event: RentalEnded | PriceOfTripWasCalculated): Promise<void> {
    },
    subscribesTo: [],
};

describe('Report of monthly expenditure', () => {
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
            .assertScenario(runAssertionsOnProjector(projector));
    });
});
