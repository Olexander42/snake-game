import { normalize as normalizeValue } from "../common/utils.js";
import { background, border, container, root, sizeInput } from "../common/elements.js";

let borderThick = null;
let bgClip = null;
let bounds = null;
let center = null;

export let data = null;

export function normalize() {
  borderThick = Number(sizeInput.value);
  bgClip = borderThick;

  root.style.setProperty("--size", `${borderThick}px`);
  root.style.setProperty("--clip", `${bgClip}px`);

  bounds = {
    width: normalizeValue(container.clientWidth, borderThick),
    height: normalizeValue(container.clientHeight, borderThick),
  };
  
 
  [container, background, border,].forEach(element => {
    element.style.width = `${bounds.width}px`;
    element.style.height = `${bounds.height}px`;
  })

  updateData();
}
  
export function shrink() {
  bounds.width -= borderThick;
  bounds.height -= borderThick;

  // we don't resize container to avoid snake shift
  border.style.width = `${bounds.width}px`;
  border.style.height =`${bounds.height}px`;

  // background
  bgClip += borderThick / 2;
  root.style.setProperty("--clip", `${bgClip}px`);

  updateData();
}

function updateData() {
  data = {
    left: bgClip,
    right: container.clientWidth - bgClip - borderThick, // - borderThick to offest distance to head.left
    top: bgClip,
    bottom: container.clientHeight - bgClip - borderThick, // - borderThick to offest distance to head.top 
    
    step: borderThick / 2,
  }
}














