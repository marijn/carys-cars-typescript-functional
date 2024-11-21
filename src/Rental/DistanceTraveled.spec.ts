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

const calculateDistanceTraveled: (a: DistanceTraveled, b: DistanceTraveled) => DistanceTraveled = (a, b) => {
    const delta = parseFloat(b) - parseFloat(a);
    const beforeDecimal: number = Math.floor(delta);
    const afterDecimal: number = parseInt(((delta - beforeDecimal) * 10).toFixed(0));

    return `${beforeDecimal}.${afterDecimal} km`;
};

describe('Distance traveled', () => {
    const examples: string[] = [
        '1739.7 km',
        '5371.0 km',
    ];

    it.each(examples)("expresses distance traveled in kilometers (%s)", (input: string)=> {
        const actual = distanceTraveledToString(distanceTraveledFromString(input));

        const expected = input;
        expect(actual).toEqual(expected);
    });

    const examplesOfTraveledDistanceBetweenAAndB = [
        ['1482.2 km', '1519.8 km', '37.6 km'],
        ['482.0 km', '482.0 km', '0.0 km'],
        ['7192.0 km', '7198.2 km', '6.2 km'],
    ];

    it.each(examplesOfTraveledDistanceBetweenAAndB)("calculates distance traveled between A and B (a = %s, b = %s, distance traveled = %s)", (a: DistanceTraveled, b: DistanceTraveled, distanceTraveled: DistanceTraveled) => {
        const actual: DistanceTraveled = calculateDistanceTraveled(a, b);

        const expected: DistanceTraveled = distanceTraveled;
        expect(actual).toEqual(expected);
    });
});
