import {describe, expect, it} from '@jest/globals';
import {durationOfTripFromString, durationOfTripToString} from "./DurationOfTrip";

describe('Duration of trip', () => {
    let examples: string[] = [
        '00d 00h 14m',
        '00d 02h 11m',
        '01d 14h 41m',
    ];

    it.each(examples)('converts from and to string', (input: string) => {
        const actual = durationOfTripToString(durationOfTripFromString(input));

        const expected = input;
        expect(actual).toEqual(expected);
    });
});
