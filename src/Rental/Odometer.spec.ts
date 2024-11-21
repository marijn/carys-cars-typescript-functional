import {describe, expect, it} from "@jest/globals";

type Odometer<
    Before extends number = number,
    After extends number = number
> = `${Before}.${After} km`;

const odometerToString: (input: Odometer) => string = (input) => {
    return input;
};

const odometerFromString: (input: string) => Odometer = (input) => {
    const parsed = input.match(/^(?<beforeDecimal>[0-9]+).(?<after>[0-9]) km$/);
    const beforeDecimal = parseFloat(parsed.groups['beforeDecimal']);
    const afterDecimal = parseFloat(parsed.groups['after']);

    return `${beforeDecimal}.${afterDecimal} km`;
};

describe('Odometer', () => {
    const examples: string[] = [
        '1739.7 km',
        '5371.0 km',
    ];

    it.each(examples)("expresses distance traveled in kilometers (%s)", (input: string)=> {
        const actual = odometerToString(odometerFromString(input));

        const expected = input;
        expect(actual).toEqual(expected);
    });
});
