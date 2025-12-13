import { sizeSlider } from "./elements.js";

export const getMinSizeUnit = () => parseInt(sizeSlider.value) * 0.5; // "* 0.5" because board shrinks half of sizeSlider.value from each side

