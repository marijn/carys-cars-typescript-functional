import {describe, expect, it} from "@jest/globals";
import {agreementIdFromString, agreementIdToTripId, tripIdToAgreementId} from "../Rental/AgreementId";

describe("Trip ID", () => {
    it("Converts from AgreementId and back", () => {
        const agreementId = agreementIdFromString("agreement:11111111-1111-1111-1111-111111111111");

        const actual = tripIdToAgreementId(agreementIdToTripId(agreementId));

        const expected = agreementId;
        expect(actual).toEqual(expected);
    });
});
