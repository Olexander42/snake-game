import { root, container } from "./elements.js";
import { normalize } from "./utils.js";


const TIME_UNIT = 500; 


const raf = { id: undefined };
const settingsVisited = { state: false };



const stats = { 
  score: {
    element: document.getElementById("score"),
    value: 0,
  },

  record: {
    element: document.getElementById("record"),
    value: 0,
  }
}



export { time, raf, states, stats, shrinkCounter, TIME_UNIT, size_unit, center };