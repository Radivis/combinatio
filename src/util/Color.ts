import { hslColorObject } from "../interfaces";


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
}

export default Color;