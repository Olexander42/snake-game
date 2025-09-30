import { buttons, containerEl } from './elements.js';

import { normalize } from './helpers.js';

const sizes = { width: Math.floor(buttons.size.value / 2) * 2 };
sizes.step = sizes.width / 2;
sizes.clip = sizes.width;

const container = { width: normalize(containerEl.clientWidth, sizes.step), height: normalize(containerEl.clientHeight, sizes.step) };
const border = { width: container.width, height: container.height };
const borderCenter = {};

const time = {unit: 500, gap: 500};

const stats = { score: 0, record: 0 };

export { sizes, stats, container, border, borderCenter, time }