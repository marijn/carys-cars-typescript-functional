import {describe, expect, it} from "@jest/globals";
import {
    calculateDistanceTraveled,
    DistanceTraveled,
    distanceTraveledFromString,
    distanceTraveledToString
} from "./DistanceTraveled";

const lowestDistanceTraveled: (a: DistanceTraveled, b: DistanceTraveled) => DistanceTraveled = (a, b) => {
    return distanceTraveledFromString(`${Math.min(parseFloat(a), parseFloat(b)).toFixed(1)} km`);
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

    const examplesOfTraveledDistanceBetweenAAndB: [DistanceTraveled, DistanceTraveled, DistanceTraveled][] = [
        ['1482.2 km', '1519.8 km', '37.6 km'],
        ['482.0 km', '482.0 km', '0.0 km'],
        ['7192.0 km', '7198.2 km', '6.2 km'],
        ['301.4 km', '250.0 km', '-51.4 km'],
    ];

    it.each(examplesOfTraveledDistanceBetweenAAndB)("calculates distance traveled between A and B (a = %s, b = %s, distance traveled = %s)", (a: DistanceTraveled, b: DistanceTraveled, distanceTraveled: DistanceTraveled) => {
        const actual: DistanceTraveled = calculateDistanceTraveled(a, b);

        const expected: DistanceTraveled = distanceTraveled;
        expect(actual).toEqual(expected);
    });

    it("picks lowest of two", () => {
        const lowest: DistanceTraveled = '0.0 km';
        const highest: DistanceTraveled = '0.1 km';

        const actual: DistanceTraveled = lowestDistanceTraveled(lowest, highest);

        const expected: DistanceTraveled = lowest;
        expect(actual).toEqual(expected);
    });
});
