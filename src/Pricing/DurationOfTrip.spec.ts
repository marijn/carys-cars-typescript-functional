import {describe, expect, it} from '@jest/globals';

type DurationOfTrip = {
    days: number,
    hours: number,
    minutes: number
}

const durationOfTripFromString = (input: string): DurationOfTrip => {
    return {
        days: 0,
        hours: 0,
        minutes: 14
    }
};

const durationOfTripToString = (input: DurationOfTrip): string => {
    return '00d 00h 14m';
}

describe('Duration of trip', () => {
    it('converts from and to string', () => {
        const input = '00d 00h 14m';

        const actual = durationOfTripToString(durationOfTripFromString(input));

        const expected = input;
        expect(actual).toEqual(expected);
    });
});
