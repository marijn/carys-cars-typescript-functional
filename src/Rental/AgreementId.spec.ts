import {describe, expect, it} from "@jest/globals";

type AgreementId = `agreement:${string}`

class SorryUnsupportedAgreementId extends Error {
    constructor(
        msg: string,
        public readonly input: string,
    ) {
        super(msg);

        Object.setPrototypeOf(this, SorryUnsupportedAgreementId.prototype);
    }
}

const agreementIdFromString: (input: string) => AgreementId = (input) => {
    const parsed = input.match(/^agreement:(?<unique>\S*)$/);
    // intentional usage of less constraint pattern to allow uuids human-readable UUIDs for testing
    // (e.g. AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA or 11111111-1111-1111-1111-111111111111)
    const poorPersonsUuidTest = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if ( ! poorPersonsUuidTest.test(parsed.groups['unique'])) {
        throw new SorryUnsupportedAgreementId(
            'Sorry, the id does not match the expected format ("agreement:${uuid}")',
            input
        );
    }

    return `agreement:${parsed.groups['unique']}`;
};

const agreementIdToString: (agreementId: AgreementId) => string = (agreementId) => {
    return agreementId;
};

describe('Agreement ID', () => {
    const examples: string[] = [
        "agreement:11111111-1111-1111-1111-111111111111",
        "agreement:ee5accf0-605c-4de7-95bb-623af10f5cd9",
    ];

    it.each(examples)('is composed of agreement prefix and unique identifier', (input: string) => {
        const actual: string = agreementIdToString(agreementIdFromString(input));

        const expected = input;
        expect(actual).toEqual(expected);
    });

    it('guards against unsupported identifiers', () => {
        const unsupportedIdentifier: string = 'agreement:1743518';

        expect(() => {
            const actual = agreementIdFromString(unsupportedIdentifier);
        }).toThrowError(
            new SorryUnsupportedAgreementId(
                'Sorry, the id does not match the expected format ("agreement:${uuid}")',
                unsupportedIdentifier
            )
        )
    });
});
