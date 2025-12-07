import { sizeSlider } from "./elements.js";

export const getMinSizeUnit = () => parseInt(sizeSlider.value) / 2; // because board shrinks half of sizeSlider.value from each side