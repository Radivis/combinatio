import Color from "./Color";

class Colors extends Array<Color> {
    // constructor suppors making Colors from a single color or an array or colors (serialized or not)
    constructor(colorData: ({color: Color | string, length: number} | Array<Color | string>)) {
        super();
        if (Array.isArray(colorData)) {
            colorData.forEach((color, index) => {
                if (typeof color === 'string') this[index] = Color.deserialize(color);
                else this[index] = color;
            });
        } else {
            const { color } = colorData;
            for (let i = 0; i < this.length; i++) {
                if (typeof color === 'string') this[i] = Color.deserialize(color);
                else this[i] = color;
            }
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