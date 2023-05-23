import Color from "./Color";

class Colors extends Array<Color> {
    constructor(colorData: ({color: Color, length: number} | Array<Color>)) {
        super();
        if (Array.isArray(colorData)) {
            colorData.forEach((color, index) => this[index] = color);
        } else {
            for (let i = 0; i < this.length; i++) {
                this[i] = colorData.color;
            }
        }
    }

    public readonly clone = () => {
        return new Colors(this as Array<Color>);
    }
}

export default Colors;