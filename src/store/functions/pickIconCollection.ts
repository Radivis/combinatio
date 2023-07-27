import { iconNames } from "../../constants";

const pickIconCollection = (numIcons: number) => {
    const iconCollection: string[] = [];

    while (iconCollection.length < numIcons) {
        const randomIconName = iconNames[Math.floor(Math.random() * iconNames.length)];
        if (!iconCollection.includes(randomIconName)) iconCollection.push(randomIconName);
    }

    return iconCollection;
} 

export default pickIconCollection;