import {describe, expect, it} from "@jest/globals";
import {agreementIdFromString, agreementIdToString, SorryUnsupportedAgreementId} from "./AgreementId";

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
