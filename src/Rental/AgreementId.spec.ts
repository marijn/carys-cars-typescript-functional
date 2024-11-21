import {describe, expect, it} from "@jest/globals";

type AgreementId = `agreement:${string}`

const agreementIdFromString: (input: string) => AgreementId = (input) => {
    return "agreement:11111111-1111-1111-1111-111111111111";
};

const agreementIdToString: (agreementId: AgreementId) => string = (agreementId) => {
    return "agreement:11111111-1111-1111-1111-111111111111";
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
});
