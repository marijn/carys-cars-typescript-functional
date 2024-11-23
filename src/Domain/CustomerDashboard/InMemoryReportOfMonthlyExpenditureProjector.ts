import {
    AllMonths,
    AllYears,
    EndedRentalAgreement,
    ReportingMonth,
    ReportOfMonthlyExpenditureAnswers,
    ReportOfMonthlyExpenditureEvents,
    ReportOfMonthlyExpenditureProjector,
    ReportOfMonthlyExpenditureQueries,
    Trip
} from "./ReportOfMonthlyExpenditure";
import {AgreementId} from "../Rental/AgreementId";

export const inMemoryReportOfMonthlyExpenditureProjector: () => ReportOfMonthlyExpenditureProjector = () => {
    const agreementsByAgreementId: { [key: AgreementId]: EndedRentalAgreement } = {};
    const tripsByCustomer: { [key: CustomerId]: Partial<Record<ReportingMonth, Trip[]>> } = {};

    return {
        async ask(query: ReportOfMonthlyExpenditureQueries): Promise<ReportOfMonthlyExpenditureAnswers> {
            return {
                _named: "Report of monthly expenditure by customer",
                customerId: query.customerId,
                month: query.month,
                trips: query.customerId in tripsByCustomer
                    ? (query.month in tripsByCustomer[query.customerId] ? tripsByCustomer[query.customerId][query.month] : [])
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

                    if (!(event.customerId in tripsByCustomer)) {
                        tripsByCustomer[event.customerId] = {};
                    }

                    if (!(agreement.month in tripsByCustomer[event.customerId])) {
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
