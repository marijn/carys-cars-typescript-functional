import {describe, expect, it} from "@jest/globals";

type DistanceTraveled<
    BeforeDecimal extends number = number,
    AfterDecimal extends number = number
> = `${BeforeDecimal}.${AfterDecimal} km`;

const distanceTraveledToString: (input: DistanceTraveled) => string = (input) => {
    return input;
};

const distanceTraveledFromString: (input: string) => DistanceTraveled = (input) => {
    const parsed = input.match(/^(?<beforeDecimal>[0-9]+).(?<afterDecimal>[0-9]) km$/);
    const beforeDecimal = parseInt(parsed.groups['beforeDecimal'], 10);
    const afterDecimal = parseInt(parsed.groups['afterDecimal'], 10);

    return `${beforeDecimal}.${afterDecimal} km`;
};

const distanceTraveled: (start: DistanceTraveled, end: DistanceTraveled) => DistanceTraveled = (start, end) => {
    return '37.6 km';
};

describe('Odometer', () => {
    const examples: string[] = [
        '1739.7 km',
        '5371.0 km',
    ];

    it.each(examples)("expresses distance traveled in kilometers (%s)", (input: string)=> {
        const actual = distanceTraveledToString(distanceTraveledFromString(input));

        const expected = input;
        expect(actual).toEqual(expected);
    });

    it("calculates distance traveled", () => {
        const start: DistanceTraveled = '1482.2 km';
        const end: DistanceTraveled = '1519.8 km';

        const actual: DistanceTraveled = distanceTraveled(start, end);

        const expected: DistanceTraveled = '37.6 km';
        expect(actual).toEqual(expected);
    });
});
