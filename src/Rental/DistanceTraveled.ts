export type DistanceTraveled<
    BeforeDecimal extends number = number,
    AfterDecimal extends number = number
> = `${BeforeDecimal}.${AfterDecimal} km`;
export const distanceTraveledToString: (input: DistanceTraveled) => string = (input) => {
    return input;
};
export const distanceTraveledFromString: (input: string) => DistanceTraveled = (input) => {
    const parsed = input.match(/^(?<beforeDecimal>[0-9]+).(?<afterDecimal>[0-9]) km$/);
    const beforeDecimal = parseInt(parsed.groups['beforeDecimal'], 10);
    const afterDecimal = parseInt(parsed.groups['afterDecimal'], 10);

    return `${beforeDecimal}.${afterDecimal} km`;
};
export const calculateDistanceTraveled: (a: DistanceTraveled, b: DistanceTraveled) => DistanceTraveled = (a, b) => {
    const delta = parseFloat(b) - parseFloat(a);
    const beforeDecimal: number = Math.floor(delta);
    const afterDecimal: number = parseInt(((delta - beforeDecimal) * 10).toFixed(0));

    return `${beforeDecimal}.${afterDecimal} km`;
};
