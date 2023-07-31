import generateDefaultRowColorsDataString from "./store/functions/generateDefaultRowColorsDataString";
import Color from "./util/Color";
import ColorIcons from "./util/ColorIcons";
import Colors from "./util/Colors";

export const gameVersionNumber = '0.6.0';
export const defaultNumColumns = 4;
export const defaultNumRows = 8;
export const defaultNumColors = 6;
export const defaultNumIcons = 6;
export const defaultBaseSaturation = 75;
export const defaultBaseLightness = 50;
export const holeHue = 34;
export const holeSaturation = 57;
export const holeLightness = 20;
export const holeColor = new Color(holeHue, holeSaturation, holeLightness);
export const gameStates = ['starting', 'running', 'won', 'lost'];
export const paletteNames = ['regular', 'zanthia'];
export const iconNames = [
    'asterisk',
    'battery-half',
    'bolt',
    'brain',
    'cannabis',
    'car-side',
    'cat',
    'circle',
    'circle-dot',
    'clover',
    'cow',
    'crown',
    'cubes',
    'diamond',
    'dog',
    'dove',
    'droplet',
    'egg',
    'fish-fins',
    'gear',
    'guitar',
    'heart',
    'helicopter',
    'hourglass-half',
    'horse',
    'kit-medical',
    'lightbulb',
    'motorcycle',
    'person-biking',
    'person-walking',
    'plane-up',
    'scissors',
    'skull',
    'spaghetti-monster-flying',
    'square',
    'shield',
    'star',
    'toilet-paper',
    'tree',
    'trophy',
    'wheelchair-move',
];


export enum pieceTypes {
    color = 'color',
    colorIcon = 'colorIcon',
    icon = 'icon'
}

export const emptyCombinationNote: [string, string] = [`${ColorIcons
    .serialize(ColorIcons
        .fuse(Colors.deserialize(generateDefaultRowColorsDataString(2)), ['', '']))}`,''];
