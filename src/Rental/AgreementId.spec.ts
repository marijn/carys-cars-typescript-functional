import {describe, expect, it} from "@jest/globals";

type AgreementId = `agreement:${string}`

const agreementIdFromString: (input: string) => AgreementId = (input) => {
    return "agreement:11111111-1111-1111-1111-111111111111";
};

const agreementIdToString: (agreementId: AgreementId) => string = (agreementId) => {
    return "agreement:11111111-1111-1111-1111-111111111111";
};

describe('Agreement ID', () => {
    const input = "agreement:11111111-1111-1111-1111-111111111111";
    const examples: string[] = [
        input,
    ];

    it.each(examples)('is composed of agreement prefix and unique identifier', () => {

        const actual: string = agreementIdToString(agreementIdFromString(input));

        const expected = input;
        expect(actual).toEqual(expected);
    });
});
