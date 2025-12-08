import { normalize as normalizeValue } from "../common/utils.js";
import {  border, background, root } from "../common/elements.js";
import { getMinSizeUnit } from "../common/config.mjs";


let container, bounds;

export function normalize() {
  updateSizeUnits();

  container ??= document.getElementById("container");
  // calculate
  bounds = {
    width: normalizeValue(container.clientWidth, sizeUnit),
    height: normalizeValue(container.clientHeight, sizeUnit),
  };

  // apply
  [container, background, border,].forEach(element => {
    element.style.width = `${bounds.width}px`;
    element.style.height = `${bounds.height}px`;
  })

  updateData();
}


export function shrink() {
  // We don't resize container to keep snake's position fixed during the shrink.
  bounds.width -= sizeUnit;
  bounds.height -= sizeUnit;

  border.style.width = `${bounds.width}px`;
  border.style.height =`${bounds.height}px`;

  // background
  backgroundClip += sizeUnit / 2; // Clip is applied from both sides.
  root.style.setProperty("--clip", `${backgroundClip}px`);

  updateData();
}


let sizeUnit, backgroundClip,

function updateSizeUnits() {
  sizeUnit = getMinSizeUnit() * 2; // Board shrinks half of sizeSlider.value from each side.
  backgroundClip = sizeUnit;

  // apply
  root.style.setProperty("--size", `${sizeUnit}px`);
  root.style.setProperty("--clip", `${backgroundClip}px`);
}


export const data = () => {
  return {
    get left() { return backgroundClip },
    get right() { return clientWidth - backgroundClip - sizeUnit }, // - sizeUnit to offest distance to headEl.left 
    get top() { return backgroundClip },
    get bottom() { return container.clientHeight - backgroundClip - sizeUnit }, // - sizeUnit to offest distance to headEl.top.
  }
}


export const center = () => {
  return { 
    get x() { return normalizeValue(Math.round(container.clientWidth) / 2, step) },
    get y() { return normalizeValue(Math.round(container.clientHeight) / 2, step) }, 
  }
}


















