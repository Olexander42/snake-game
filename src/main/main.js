import { board } from '../ui/board/board.js';

import { snake } from '../components/snake/snake.js';

import { food } from '../components/food/food.js';

snake.ini();
snake.snapshot();

food.teleport();

/*
root.style.setProperty("--size", `${sizes.width}px`);
root.style.setProperty("--time-gap", `${time.gap / 1000}s`);

const stats = { score: 0, record: 0 };

scoreEl.innerText = `Score: ${stats.score}`;
recordEl.innerText = `Record: ${stats.record}`;
*/















