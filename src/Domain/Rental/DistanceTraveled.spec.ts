import {describe, expect, it} from "@jest/globals";
import {
    calculateDistanceTraveled,
    DistanceTraveled,
    distanceTraveledFromString,
    distanceTraveledToString
} from "./DistanceTraveled";

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
    ];

    it.each(examplesOfTraveledDistanceBetweenAAndB)("calculates distance traveled between A and B (a = %s, b = %s, distance traveled = %s)", (a: DistanceTraveled, b: DistanceTraveled, distanceTraveled: DistanceTraveled) => {
        const actual: DistanceTraveled = calculateDistanceTraveled(a, b);

        const expected: DistanceTraveled = distanceTraveled;
        expect(actual).toEqual(expected);
    });
});
