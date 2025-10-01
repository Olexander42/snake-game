import { normalize, splitColor } from "./utils.js";
import { buttons, containerEl } from "./elements.js";

const time = {unit: 500, gap: 500};

const stats = { score: 0, record: 0 };

const interval = {id: 0};

const shrinkCounter = { outer: 1, inner: 0 }

const sizes = { width: Math.floor(buttons.size.value / 2) * 2 };
sizes.step = sizes.width / 2;
sizes.clip = sizes.width;
sizes.container = { 
  width: normalize(containerEl.clientWidth, sizes.step),
  height: normalize(containerEl.clientHeight, sizes.step) 
};
sizes.containerCenter = {
  x: normalize(Math.round(sizes.container.width / 2), sizes.step),
  y: normalize(Math.round(sizes.container.height / 2), sizes.step),
}
sizes.border = { width: sizes.container.width, height: sizes.container.height };


const color = { string: "hsl(120, 100%, 25%)" }
color.hsl = splitColor(color.string);

export { time, stats, interval, shrinkCounter, sizes, color }

