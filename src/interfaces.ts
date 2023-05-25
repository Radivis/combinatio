import Colors from "./util/Colors";

export interface hslColorObject {
    hue: number;
    saturation: number;
    lightness: number;
}

export interface settings {
    numColors: number,
    numRows: number,
    palette: Colors,
}