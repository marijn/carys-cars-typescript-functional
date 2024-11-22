import {describe, expect, it} from '@jest/globals';
import {
    DurationOfTrip,
    durationOfTripFromStartAndEnd,
    durationOfTripFromString,
    durationOfTripToString
} from "./DurationOfTrip";
import {LocalDateTime, ZonedDateTime, ZoneId} from "js-joda";
import '@js-joda/timezone';

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
        const start: ZonedDateTime = ZonedDateTime.of(
            LocalDateTime.parse("2024-09-12T10:22"),
            ZoneId.of("UTC+2")
        );
        const end: ZonedDateTime = ZonedDateTime.of(
            LocalDateTime.parse("2024-09-12T10:39"),
            ZoneId.of("UTC+2")
        );

        const actual = durationOfTripFromStartAndEnd(start, end)

        const expected = durationOfTripFromString('00d 00h 17m');
        expect(actual).toEqual(expected);
    })

    it("Casts to string using language native method", () => {
        const input = '01d 14h 41m';
        const actual = durationOfTripFromString(input).toString();

        const expected = input;
        expect(actual).toEqual(expected);
    });
});
