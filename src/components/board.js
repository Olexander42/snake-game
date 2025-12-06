import { normalize as normalizeValue } from "../common/utils.js";
import { background, border, container, root, sizeInput } from "../common/elements.js";


let borderThick;
let backgroundClip;
let bounds;

export function normalize() {
  borderThick = parseInt(sizeInput.value)
  backgroundClip = borderThick;

  root.style.setProperty("--size", `${borderThick}px`);
  root.style.setProperty("--clip", `${backgroundClip}px`);

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

  // We don't resize container to keep snake's position fixed during the shrink.
  border.style.width = `${bounds.width}px`;
  border.style.height =`${bounds.height}px`;

  backgroundClip += borderThick / 2; // because clip is applied from both sides.
  root.style.setProperty("--clip", `${backgroundClip}px`);

  updateData();
}

export let data;

function updateData() {
  data = {
    left: backgroundClip,
    right: container.clientWidth - backgroundClip - borderThick, // - borderThick to offest distance to head.left.
    top: backgroundClip,
    bottom: container.clientHeight - backgroundClip - borderThick, // - borderThick to offest distance to head.top.
  }

  console.log(JSON.stringify(data, null, 2));
}














