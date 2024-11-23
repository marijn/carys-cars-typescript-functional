export type DutchLicensePlate = `NL:${string}`;
export type GermanLicensePlate = `DE:${string}`;
export type SwissLicensePlate = `CH:${string}`;
export type DanishLicensePlate = `DK:${string}`;

export type LicensePlate =
    | DutchLicensePlate
    | GermanLicensePlate
    | SwissLicensePlate
    | DanishLicensePlate
