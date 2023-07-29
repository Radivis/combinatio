import Color from "./Color";

class ColorIcon extends Color {
    public _iconName: string;

    constructor(hue: number, saturation: number, lightness: number, iconName: string) {
        super(hue, saturation, lightness);
        this._iconName = iconName;
    }

    public static fuse(color: Color, iconName: string): ColorIcon {
        return new ColorIcon(color.hue, color.saturation, color.lightness, iconName);
    }

    get iconName(): string {
        return this._iconName;
    }

    public copy = (): ColorIcon => {
        return new ColorIcon(this.hue, this.saturation, this.lightness, this.iconName);
    }

    public equals(otherColorIcon: ColorIcon): boolean {
        if (otherColorIcon === undefined) return false;
        return this.hue === otherColorIcon.hue &&
        this.saturation === otherColorIcon.saturation &&
        this.lightness === otherColorIcon.lightness &&
        this.iconName === otherColorIcon.iconName;
    }

    public hasSameIcon(otherColorIcon: ColorIcon | undefined): boolean {
        if (otherColorIcon === undefined) return false;
        return this.iconName === otherColorIcon.iconName;
    }

    public hasCommonAttribute(otherColorIcon: ColorIcon): boolean {
        if (otherColorIcon === undefined) return false;
        return this.iconName === otherColorIcon.iconName || this.hue === otherColorIcon.hue;
    }

    public serialize(): string {
        return `[hsl(${this.hue},${this.saturation}%,${this.lightness}%),${this.iconName}]`;
    }

    public static deserialize(colorString: string): ColorIcon {
        const parts = colorString.split(')');
        // unpack hue, saturation, and lightness from colorString
        const colorCoreString = parts[0].substring(colorString.indexOf('(')+1);
        // Remove ',' at start and ']' at end
        const iconName = parts[1].substring(1,parts[1].length-1);
        // remove the % signs and get the correct values
        const [hue, saturation, lightness] = colorCoreString
            .replaceAll('%','')
            .split(',')
            .map(value => +value);

        return new ColorIcon(hue, saturation, lightness, iconName);
    }
}

export default ColorIcon;