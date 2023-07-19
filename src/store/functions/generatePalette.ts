import { defaultBaseLightness, defaultBaseSaturation, paletteNames } from "../../constants";
import Color from "../../util/Color";
import Colors from "../../util/Colors";

export const generateRegularPalette = (numColors: number): Colors => {
    return new Colors([...Array(numColors).keys()].map(i => {
		return Color.makeHsl(i * 360/numColors, defaultBaseSaturation, defaultBaseLightness);
    }))
};

const zanthiaPalette: Colors = new Colors([
    Color.makeHsl(204, 72, 53),
    Color.makeHsl(52, 94, 51),
    Color.makeHsl(131, 74, 38),
    Color.makeHsl(343, 88, 41),
    Color.makeHsl(264, 67, 63),
    Color.makeHsl(32, 59, 48)
]);

const generatePalette = (numberColors: number, paletteName: string): Colors => {
    switch (paletteName) {
        case paletteNames[1]:
            return zanthiaPalette;
        default:
            return generateRegularPalette(numberColors);
    }
 }

 export default generatePalette;