import {describe, expect, it} from '@jest/globals';

type DurationOfTrip = {
    days: number,
    hours: number,
    minutes: number
}

const durationOfTripFromString = (input: string): DurationOfTrip => {
    throw new Error('TODO: Implement me');
};

const durationOfTripToString = (input: DurationOfTrip): string => {
    throw new Error('TODO: Implement me');
}

describe('Duration of trip', () => {
    it('converts from and to string', () => {
        const input = '00d 00h 14m';

        const actual = durationOfTripToString(durationOfTripFromString(input));

        const expected = input;
        expect(actual).toEqual(expected);
    });
});
