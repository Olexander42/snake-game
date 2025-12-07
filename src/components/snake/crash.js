import { roundTo } from "../../common/utils.js";
import { snake as div } from "../elements.js";
import { speedUp, snapshot, color, body, headData } from "./init.js";


const DESATURATION = 0.15;

export function greyout(duration) {
  let timeLeft = duration;
  let i = 0;
  let j = body.length + 1;

  color.hslComponents.s *= DESATURATION; 

  const greyoutSection = (ms) => {
    ms = timeLeft / ( 2 ** (j - i));
    timeLeft -= ms;
    // sections greyout sequentially
    setTimeout(() => {
      const color = color.changeColor({ changeL: i }); // The original lightness is preserved.
      const section = body[i];

      section.style.backgroundColor = color;

      i++;
      if (i < body.length) setTimeout(() => greyoutSection(ms), ms);  
    }, ms)
  }
  greyoutSection(0);
}

export const disappear = () => div.replaceChildren();











 






 