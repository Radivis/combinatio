import Color from "./Color";

class Colors extends Array<Color> {
    // constructor suppors making Colors from a single color or an array or colors (serialized or not)
    constructor(colorData: ({color: Color | string, length: number} | Array<Color | string>)) {
        super();
        if (Array.isArray(colorData)) {
            // Create Colors object from an Array
            colorData.forEach((color, index) => {
                if (typeof color === 'string') this[index] = Color.deserialize(color);
                else this[index] = color;
            });
        } else {
            // Create Colors object from a single color and a length
            const { color, length } = colorData;
            for (let i = 0; i < length; i++) {
                if (typeof color === 'string') this[i] = Color.deserialize(color);
                else this[i] = color;
            }
        }
    }

    public readonly has = (color: Color): boolean => {
        for (let i = 0; i < this.length; i++) {
            if (color.equals(this[i])) return true;
        }
        return false;
    }

    public readonly indexOfColor = (color: Color): number => {
        let index = -1
        for (let i = 0; i < this.length; i++) {
            if (color.equals(this[i])) index = i;
        }
        return index;
    }

    public readonly add = (color: Color) => {
        if(!this.has(color)) {
            this.push(color);
        }
    }

    public readonly remove = (color: Color) => {
        for (let i = 0; i < this.length; i++) {
            if (color.equals(this[i])) this.splice(i, 1);
        }
    }

    public readonly copy = () => {
        return new Colors(this as Array<Color>);
    }

    public static readonly serialize = (colors: Colors): string => {
        if (!Array.isArray(colors)) throw new TypeError('Could not serialize colors, because the passed value is not an array');
        return JSON.stringify((colors as Array<Color>).map((color) => color.serialize()));
    }

    public static deserialize = (colorsString: string): Colors => {
        return new Colors(JSON.parse(colorsString).map((colorString: string) => Color.deserialize(colorString)));
    }
}

export default Colors;