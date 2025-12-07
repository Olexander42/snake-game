import { speedUp, div, snapshot, color, body, headData } from "./init.js";


export const isAteFood = (foodCoords) => headData.x === foodCoords.x && headData.y === foodCoords.y;

const ACCELERATION = 0.25;

export function levelUp() { 
  speedUp(ACCELERATION);
  grow();
  snapshot();
  rescaleSections();
}

function grow() {
  const oldTailEl = body[body.length - 1];
  if (oldTailEl.id === "tail") oldTailEl.id = ""; // TODO: try to get rid of this or move it

  const tailEl = oldTailEl.cloneNode(false);
  tailEl.id = "tail"; // why do we need this id?
  tailEl.style.zIndex = `-${body.length}`; // correct overlapping 
  tailEl.style.backgroundColor = color.changeColor({ changeL: body.length }); // Each section gets progressively lighter.
  div.append(tailEl);
}

function rescaleSections() {
  // Tapering effect.
  let scale = 0;
  let i = 0; 
  
  body.forEach((element) => { 
    scale += 1 / (2 ** i); 
    element.style.scale = Math.min(`${roundTo(scale, 2)}`, 1); 
  })
}
