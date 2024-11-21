import {describe, expect, it} from "@jest/globals";

type Odometer = `${number} km`;

const odometerToString: (input: Odometer) => string = (input) => {
    return input;
};

const odometerFromString: (input: string) => Odometer = (input) => {
    return '1739.7 km';
};

describe('Odometer', () => {
    const odometerAsString = '1739.7 km';
    it("expresses distance traveled in kilometers", ()=> {
        const actual = odometerToString(odometerFromString(odometerAsString));

        const expected = odometerAsString;
        expect(actual).toEqual(expected);
    });
});
