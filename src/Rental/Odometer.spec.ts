import {describe, expect, it} from "@jest/globals";

type Odometer = `${number} km`;

const odometerToString: (input: Odometer) => string = (input) => {
    throw new Error('TODO: Implement');
};

const odometerFromString: (input: string) => Odometer = (input) => {
    throw new Error('TODO: Implement me');
};

describe('Odometer', () => {
    it("expresses distance traveled in kilometers", ()=> {
        const odometerAsString = '1739.7 km';

        const actual = odometerToString(odometerFromString(odometerAsString));

        const expected = odometerAsString;
        expect(actual).toEqual(expected);
    });
});
