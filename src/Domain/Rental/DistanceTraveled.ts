export type DistanceTraveled<
    BeforeDecimal extends number = number,
    AfterDecimal extends number = number
> = `${BeforeDecimal}.${AfterDecimal} km`;

export const distanceTraveledToString: (input: DistanceTraveled) => string = (input) => {
    return input;
};

/**
 * @param input (e.g. "241.0 km" or "517.1 km")
 */
export const distanceTraveledFromString: (input: string) => DistanceTraveled = (input) => {
    const parsed = input.match(/^(?<beforeDecimal>-?[0-9]+).(?<afterDecimal>[0-9]) km$/);
    const beforeDecimal = parseInt(parsed.groups['beforeDecimal'], 10);
    const afterDecimal = parseInt(parsed.groups['afterDecimal'], 10);

    return `${beforeDecimal}.${afterDecimal} km`;
};

export const calculateDistanceTraveled: (a: DistanceTraveled, b: DistanceTraveled) => DistanceTraveled = (a, b) => {
    const delta = parseFloat(b) - parseFloat(a);
    const beforeDecimal: number = delta > 0 ? Math.floor(delta) : Math.ceil(delta);
    const afterDecimal: number = Math.abs(parseInt(((delta - beforeDecimal) * 10).toFixed(0)));

    return `${beforeDecimal}.${afterDecimal} km`;
};

export const lowestDistanceTraveled: (a: DistanceTraveled, b: DistanceTraveled) => DistanceTraveled = (a, b) => {
    const lowest = Math.min(parseFloat(a), parseFloat(b));

    return distanceTraveledFromString(`${lowest.toFixed(1)} km`);
};
