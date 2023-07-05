import { hslColorObject } from "../interfaces/interfaces";


class Color {
    private _hue: number;
    private _saturation: number;
    private _lightness: number;

    constructor(hue: number, saturation: number, lightness: number) {
        this._hue = hue;
        this._saturation = saturation;
        this._lightness = lightness;
    }

    public static makeHsl = (hue: number, saturation: number, lightness: number) => {
        return new Color(hue, saturation, lightness);
    }

    public static makeFromHslObject = (hslColorObject: hslColorObject) => {
        const { hue, saturation, lightness } = hslColorObject;
        return new Color(hue, saturation, lightness);
    }

    get hue() { return this._hue; };
    get saturation() { return this._saturation; };
    get lightness() { return this._lightness; };

    get hsl() {
        return `hsl(${this._hue},${this._saturation}%,${this._lightness}%)`;
    }

    public copy = (): Color => {
        return new Color(this.hue, this.saturation, this.lightness);
    }

    public equals(otherColor: Color): boolean {
        if (otherColor === undefined) return false;
        return this.hue === otherColor.hue &&
        this.saturation === otherColor.saturation &&
        this.lightness === otherColor.lightness;
    }

    public hasSameHue(otherColor: Color): boolean {
        if (otherColor === undefined) return false;
        return this.hue === otherColor.hue;
    }

    public serialize(): string {
        return `hsl(${this._hue},${this._saturation}%,${this._lightness}%)`;
    }

    public static deserialize(colorString: string): Color {
        // unpack hue, saturation, and lightness from colorString
        const coreString = colorString.substring(colorString.indexOf('(')+1, colorString.indexOf(')'));
        // remove the % signs and get the correct values
        const [hue, saturation, lightness] = coreString
            .replaceAll('%','')
            .split(',')
            .map(value => +value);

        return this.makeHsl(hue, saturation, lightness);
    }
}

export default Color;