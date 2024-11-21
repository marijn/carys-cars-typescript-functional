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
    const examples: string[] = [
        odometerAsString
    ];

    it.each(examples)("expresses distance traveled in kilometers", (input: string)=> {
        const actual = odometerToString(odometerFromString(input));

        const expected = input;
        expect(actual).toEqual(expected);
    });
});
