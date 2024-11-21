import {describe, expect, it} from "@jest/globals";

type AgreementId = `agreement:${string}`

const agreementIdFromString: (input: string) => AgreementId = (input) => {
    throw new Error('TODO: implement me');
};

const agreementIdToString: (agreementId: AgreementId) => string = (agreementId) => {
    throw new Error('TODO: Implement me');
};

describe('Agreement ID', () => {
    it('is composed of agreement prefix and unique identifier', () => {
        const input = "agreement:11111111-1111-1111-1111-111111111111";

        const actual: string = agreementIdToString(agreementIdFromString(input));

        const expected = input;
        expect(actual).toEqual(expected);
    });
});
