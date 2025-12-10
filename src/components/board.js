import { normalize as normalizeValue } from "../common/utils.js";
import {  borderEl, backgroundEl, root } from "../common/elements.js";
import { getMinSizeUnit } from "../common/config.mjs";


let containerEl, bounds;

export function normalize() {
  updateSizeUnits();

  containerEl ??= document.getElementById("container");
  // calculate
  bounds = {
    width: normalizeValue(containerEl.clientWidth, sizeUnit),
    height: normalizeValue(containerEl.clientHeight, sizeUnit),
  };

  // apply
  [containerEl, backgroundEl, borderEl,].forEach(element => {
    element.style.width = `${bounds.width}px`;
    element.style.height = `${bounds.height}px`;
  })

  updateData()
}


export function shrink() {
  // We don't resize containerEl to keep snake's position fixed during the shrink.
  bounds.width -= sizeUnit;
  bounds.height -= sizeUnit;

  borderEl.style.width = `${bounds.width}px`;
  borderEl.style.height =`${bounds.height}px`;

  // backgroundEl
  backgroundClip += sizeUnit / 2; // Clip is applied from both sides.
  root.style.setProperty("--clip", `${backgroundClip}px`);

  updateData();
}


let sizeUnit, backgroundClip;

function updateSizeUnits() {
  sizeUnit = getMinSizeUnit() * 2; // Board shrinks half of sizeSlider.value from each side.
  backgroundClip = sizeUnit;

  // apply
  root.style.setProperty("--size", `${sizeUnit}px`);
  root.style.setProperty("--clip", `${backgroundClip}px`);
}

export let data;
function updateData() {
  data = {
    left: backgroundClip,
    right: containerEl.clientWidth - backgroundClip - sizeUnit, // - sizeUnit to offest distance to headEl.left 
    top: backgroundClip,
    bottom: containerEl.clientHeight - backgroundClip - sizeUnit, // - sizeUnit to offest distance to headEl.top
  }
}
  

export const center = {
  get x() { return normalizeValue(Math.round(containerEl.clientWidth) / 2, sizeUnit) },
  get y() { return normalizeValue(Math.round(containerEl.clientHeight) / 2, sizeUnit) }, 
}


















