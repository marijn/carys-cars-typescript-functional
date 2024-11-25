import {TripId} from "../Pricing/TripId";

export type AgreementId = `agreement:${string}`

export class SorryUnsupportedAgreementId extends Error {
    constructor(
        msg: string,
        public readonly input: string,
    ) {
        super(msg);

        Object.setPrototypeOf(this, SorryUnsupportedAgreementId.prototype);
    }

    static becauseItDoesNotMatchTheExpectedFormat(input: string): SorryUnsupportedAgreementId {
        return new SorryUnsupportedAgreementId(
            'Sorry, the id does not match the expected format ("agreement:${uuid}")',
            input
        );
    }
}

export const agreementIdFromString: (input: string) => AgreementId = (input) => {
    const parsed = input.match(/^agreement:(?<unique>\S*)$/);
    // intentional usage of less constraint pattern to allow uuids human-readable UUIDs for testing
    // (e.g. AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA or 11111111-1111-1111-1111-111111111111)
    const poorPersonsUuidTest = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (!poorPersonsUuidTest.test(parsed.groups['unique'])) {
        throw SorryUnsupportedAgreementId.becauseItDoesNotMatchTheExpectedFormat(input);
    }

    return `agreement:${parsed.groups['unique']}`;
};
export const agreementIdToString: (agreementId: AgreementId) => string = (agreementId) => {
    return agreementId;
};

export const agreementIdToTripId: (agreementId: AgreementId) => TripId = (agreementId) => {
    return agreementId.replace('agreement:', 'trip:') as TripId;
};

export const tripIdToAgreementId: (tripId: TripId) => AgreementId = (agreementId) => {
    return agreementId.replace('trip:', 'agreement:') as AgreementId;
};
