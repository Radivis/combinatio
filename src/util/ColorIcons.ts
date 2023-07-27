import ColorIcon from "./ColorIcon";
import Colors from "./Colors";

class ColorIcons extends Array<ColorIcon> {
    // constructor suppors making ColorIcons from a single colorIcon or an array or colorIcons (serialized or not)
    constructor(colorIconData: ({colorIcon: ColorIcon | string, length: number} | Array<ColorIcon | string>)) {
        super();
        if (Array.isArray(colorIconData)) {
            // Create Colors object from an Array
            colorIconData.forEach((colorIcon: ColorIcon | string, index: number) => {
                if (typeof colorIcon === 'string') this[index] = ColorIcon.deserialize(colorIcon);
                else this[index] = colorIcon;
            });
        } else {
            // Create ColorIcons object from a single colorIcon and a length
            const { colorIcon, length } = colorIconData;
            for (let i = 0; i < length; i++) {
                if (typeof colorIcon === 'string') this[i] = ColorIcon.deserialize(colorIcon);
                else this[i] = colorIcon;
            }
        }
    }

    public static readonly fuse = (colors: Colors, iconNames: string[]): ColorIcons => {
        if (colors.length !== iconNames.length) {
            throw new Error(`Cannot fuse colors and icons with different lengths! Colors length: ${colors.length}, icons length: ${iconNames.length}`);
        }
        const colorIcons: ColorIcon[] = [];

        for (let i = 0; i < colors.length; i++) {
            colorIcons.push(ColorIcon.fuse(colors[i], iconNames[i]));
        }

        return new ColorIcons(colorIcons);

    }

    public readonly has = (colorIcon: ColorIcon): boolean => {
        for (let i = 0; i < this.length; i++) {
            if (colorIcon.equals(this[i])) return true;
        }
        return false;
    }

    public readonly indexOfColorIcon = (colorIcon: ColorIcon): number => {
        let index = -1
        for (let i = 0; i < this.length; i++) {
            if (colorIcon.equals(this[i])) index = i;
        }
        return index;
    }

    public readonly add = (colorIcon: ColorIcon) => {
        if(!this.has(colorIcon)) {
            this.push(colorIcon);
        }
    }

    public readonly equals = (colorIcons: ColorIcons): boolean => {
        let i = 0;
        while (i < colorIcons.length) {
            if (!this[i].equals(colorIcons[i])) return false;
            i++;
        }
        return true;
    }

    public readonly remove = (colorIcon: ColorIcon) => {
        for (let i = 0; i < this.length; i++) {
            if (colorIcon.equals(this[i])) this.splice(i, 1);
        }
    }

    public readonly copy = () => {
        return new ColorIcons(this as Array<ColorIcon>);
    }

    public static readonly serialize = (colorIcons: ColorIcons): string => {
        if (!Array.isArray(colorIcons)) throw new TypeError('Could not serialize colorIcons, because the passed value is not an array');
        return JSON.stringify((colorIcons as Array<ColorIcon>)
            .map((colorIcon) => colorIcon.serialize()));
    }

    public static deserialize = (colorIconsString: string): ColorIcons => {
        return new ColorIcons(JSON.parse(colorIconsString)
            .map((colorIconString: string) => ColorIcon.deserialize(colorIconString)));
    }
}

export default ColorIcons;