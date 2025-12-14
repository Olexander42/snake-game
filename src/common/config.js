import { sizeSlider } from "./elements.js";

// We halve the value because board shrinks half of sizeSlider.value from each side.
export const getMinSizeUnit = () => parseInt(sizeSlider.value) / 2; 


