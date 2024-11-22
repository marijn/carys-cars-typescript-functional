import {Duration, ZonedDateTime} from "js-joda";

const durationOfTripBrand = Symbol('durationOfTripBrand');
export type DurationOfTrip = {
    days: number,
    hours: number,
    minutes: number,
    _brand: typeof durationOfTripBrand,
}

/**
 * @param input (E.g. "01d 23h 11m")
 */
export const durationOfTripFromString = (input: string): DurationOfTrip => {
    const parsed = input.match(/^(?<days>[0-9]{2})d (?<hours>[0-9]{2})h (?<minutes>[0-9]{2})m$/);

    return {
        days: parseInt(parsed.groups['days'], 10),
        hours: parseInt(parsed.groups['hours'], 10),
        minutes: parseInt(parsed.groups['minutes'], 10),
        _brand: durationOfTripBrand
    }
};

export const durationOfTripFromStartAndEnd = (start: ZonedDateTime, end: ZonedDateTime) => {
    const delta = Duration.between(start, end);

    return {
        days: delta.toDays(),
        hours: delta.toHours(),
        minutes: delta.toMinutes(),
        _brand: durationOfTripBrand
    }
};

export const durationOfTripToString = (input: DurationOfTrip): string => {
    const daysWithLeadingZeroes = input.days.toString(10).padStart(2, "0");
    const hoursWithLeadingZeroes = input.hours.toString(10).padStart(2, "0");
    const minutesWithLeadingZeroes = input.minutes.toString(10).padStart(2, "0");

    return `${daysWithLeadingZeroes}d ${hoursWithLeadingZeroes}h ${minutesWithLeadingZeroes}m`;
}

export const tripDurationToTotalMinutes: (tripDuration: DurationOfTrip) => number
    = (tripDuration) => tripDuration.minutes + tripDuration.hours * 60 + tripDuration.days * 60 * 24;
