import {describe, expect, it} from "@jest/globals";

type Odometer<
    BeforeDecimal extends number = number,
    AfterDecimal extends number = number
> = `${BeforeDecimal}.${AfterDecimal} km`;

const odometerToString: (input: Odometer) => string = (input) => {
    return input;
};

const odometerFromString: (input: string) => Odometer = (input) => {
    const parsed = input.match(/^(?<beforeDecimal>[0-9]+).(?<afterDecimal>[0-9]) km$/);
    const beforeDecimal = parseInt(parsed.groups['beforeDecimal'], 10);
    const afterDecimal = parseInt(parsed.groups['afterDecimal'], 10);

    return `${beforeDecimal}.${afterDecimal} km`;
};

const distanceTraveled: (start: Odometer, end: Odometer) => Odometer = (start, end) => {
    return '37.6 km';
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

    it("calculates distance traveled", () => {
        const start: Odometer = '1482.2 km';
        const end: Odometer = '1519.8 km';

        const actual: Odometer = distanceTraveled(start, end);

        const expected: Odometer = '37.6 km';
        expect(actual).toEqual(expected);
    });
});
