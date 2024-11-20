import {describe, expect, it} from '@jest/globals';
import {
    DurationOfTrip,
    durationOfTripFromStartAndEnd,
    durationOfTripFromString,
    durationOfTripToString
} from "./DurationOfTrip";

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

    it('is deduced from two dates', () => {
        const start: Date = new Date('2024-09-12 10:22 Europe/Amsterdam');
        const end: Date = new Date('2024-09-12 10:39 Europe/Amsterdam');

        const actual = durationOfTripFromStartAndEnd(start, end)

        const expected = durationOfTripFromString('00d 00h 17m');
        expect(actual).toEqual(expected);
    })
});
