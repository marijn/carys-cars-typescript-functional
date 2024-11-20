import {describe, expect, it} from '@jest/globals';

type DurationOfTrip = {
    days: number,
    hours: number,
    minutes: number
}

const durationOfTripFromString = (input: string): DurationOfTrip => {
    const parsed = input.match(/^(?<days>[0-9]{2})d (?<hours>[0-9]{2})h (?<minutes>[0-9]{2})m$/);

    return {
        days: parseInt(parsed.groups['days'], 10),
        hours: parseInt(parsed.groups['hours'], 10),
        minutes: parseInt(parsed.groups['minutes'], 10)
    }
};

const durationOfTripToString = (input: DurationOfTrip): string => {
    return `00d ${input.hours.toString(10).padStart(2, "0")}h ${input.minutes.toString(10).padStart(2, "0")}m`;
}

describe('Duration of trip', () => {
    let examples: string[] = [
        '00d 00h 14m',
        '00d 02h 11m',
    ];

    it.each(examples)('converts from and to string', (input: string) => {
        const actual = durationOfTripToString(durationOfTripFromString(input));

        const expected = input;
        expect(actual).toEqual(expected);
    });
});
