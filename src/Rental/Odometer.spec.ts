import {describe, expect, it} from "@jest/globals";

type Odometer = `${number} km`;

const odometerToString: (input: Odometer) => string = (input) => {
    return input;
};

const odometerFromString: (input: string) => Odometer = (input) => {
    return '1739.7 km';
};

describe('Odometer', () => {
    const examples: string[] = [
        '1739.7 km',
        '5371.0 km',
    ];

    it.each(examples)("expresses distance traveled in kilometers (%s)", (input: string)=> {
        const actual = odometerToString(odometerFromString(input));

        const expected = input;
        expect(actual).toEqual(expected);
    });
});
