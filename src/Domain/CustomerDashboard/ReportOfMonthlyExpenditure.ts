import {RentalEnded} from "../Rental/Ending/RentalEnded";
import {PriceOfTripWasCalculated} from "../Pricing/PriceOfTripWasCalculated";
import {AgreementId} from "../Rental/AgreementId";
import {LicensePlate} from "../LicensePlate";
import {DurationOfTrip} from "../Pricing/DurationOfTrip";
import {DistanceTraveled} from "../Rental/DistanceTraveled";
import {ZonedDateTime} from "js-joda";
import {LatitudeLongitude} from "../Rental/LatitudeLongitude";
import Dinero from "dinero.js";
import {Projector} from "../../Infrastructure/Projector/Projector";
import {CustomerId} from "../CustomerId";
import {TripId} from "../Pricing/TripId";

export type AllMonths = | '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09' | '10' | '11' | '12';
export type AllYears = `20${'2' | '3' | '4'}${'1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '0'}`

export type ReportingMonth<
    ReportingYear extends AllYears = AllYears,
    ReportingMonth extends AllMonths = AllMonths
> = `${ReportingYear}-${ReportingMonth}`

type GetReportOfMonthlyExpenditureByCustomer = {
    _named: 'Get report of monthly expenditure by customer',
    customerId: CustomerId,
    month: ReportingMonth,
};

export type HistoricTrip = {
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

export type ReportOfMonthlyExpenditureByCustomer = {
    _named: 'Report of monthly expenditure by customer',
    customerId: CustomerId,
    month: ReportingMonth,
    trips: HistoricTrip[]
};

export type ReportOfMonthlyExpenditureEvents =
    | RentalEnded
    | PriceOfTripWasCalculated

export type ReportOfMonthlyExpenditureQueries = | GetReportOfMonthlyExpenditureByCustomer

export type ReportOfMonthlyExpenditureAnswers = | ReportOfMonthlyExpenditureByCustomer

export type EndedRentalAgreement = {
    odometerEnd: DistanceTraveled,
    odometerStart: DistanceTraveled,
    rentalEnded: ZonedDateTime,
    rentalStarted: ZonedDateTime,
    startPosition: LatitudeLongitude,
    endPosition: LatitudeLongitude,
    month: ReportingMonth
}

export type ReportOfMonthlyExpenditureProjector = Projector<
    ReportOfMonthlyExpenditureEvents,
    ReportOfMonthlyExpenditureQueries,
    ReportOfMonthlyExpenditureAnswers
>;