import { normalize as normalizeValue } from "../common/utils.js";
import { root } from "../common/elements.js";
import { getMinSizeUnit } from "../common/config.js";


let container, background, border;

export function init() {
  container = document.getElementById("container");
  background = document.getElementById("background");
  border = document.getElementById("border");
}


let sizeUnit, backgroundClip, bounds;

export function normalize() {
  updateSizeUnits();

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


function updateSizeUnits() {
  sizeUnit = getMinSizeUnit() * 2; // Board shrinks half of sizeSlider.value from each side.
  backgroundClip = sizeUnit;

  // apply
  root.style.setProperty("--size", `${sizeUnit}px`);
  root.style.setProperty("--clip", `${backgroundClip}px`);
}



export const data = () => {
  return {
    get left() { backgroundClip },
    get right() clientWidth - backgroundClip - sizeUnit, // - sizeUnit to offest distance to headEl.left.
    get top() backgroundClip,
    get bottom() container.clientHeight - backgroundClip - sizeUnit, // - sizeUnit to offest distance to headEl.top.
  }
}


export const center = () => {
  return { 
    get x() { normalizeValue(Math.round(container.clientWidth) / 2, step) },
    get y() { normalizeValue(Math.round(container.clientHeight) / 2, step) }, 
  }
}















