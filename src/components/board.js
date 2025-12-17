import { normalize as normalizeValue } from "../common/utils.js";
import {  root, borderEl, backgroundEl, sizeSlider } from "../common/elements.js";
import { getMinSizeUnit } from "../common/config.js";


let borders;
export const getBorders = () => ({...borders});

let containerEl, bounds;
let minSizeUnit, sizeUnit, backgroundClip;

export function normalize() {
  updateSizeUnits();

  containerEl ??= document.getElementById("container");

  bounds = {
    width: normalizeValue(containerEl.clientWidth, sizeUnit),
    height: normalizeValue(containerEl.clientHeight, sizeUnit),
  };

  [containerEl, backgroundEl, borderEl,].forEach(element => {
    element.style.width = `${bounds.width}px`;
    element.style.height = `${bounds.height}px`;
  })

  updateBorders()
}

export function shrink() {
  // We don't resize containerEl to keep snake's position fixed during the shrink.
  bounds.width -= sizeUnit;
  bounds.height -= sizeUnit;

  borderEl.style.width = `${bounds.width}px`;
  borderEl.style.height =`${bounds.height}px`;

  backgroundClip += minSizeUnit; 
  root.style.setProperty("--clip", `${backgroundClip}px`);

  updateBorders();
}

export const center = {
  get x() { return normalizeValue(Math.round(containerEl.clientWidth) / 2, sizeUnit) },
  get y() { return normalizeValue(Math.round(containerEl.clientHeight) / 2, sizeUnit) }, 
}

function updateBorders() {
  borders = {
    left: backgroundClip,
    right: containerEl.clientWidth - backgroundClip - sizeUnit, // "- sizeUnit" to offest distance to headEl.left 
    top: backgroundClip,
    bottom: containerEl.clientHeight - backgroundClip - sizeUnit, // "- sizeUnit" to offest distance to headEl.top
  }
}

function updateSizeUnits() {
  minSizeUnit = getMinSizeUnit();
  sizeUnit = minSizeUnit * 2; // board should shrink minSizeUnit from EACH side
  backgroundClip = sizeUnit - 1; // compensate for sub pixel rounding error

  root.style.setProperty("--size", `${sizeUnit}px`);
  root.style.setProperty("--clip", `${backgroundClip}px`);
}





















