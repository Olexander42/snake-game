import { direction, updateHeadRotation, boardData } from "./snake.js";

const TURN_CONFIGS = {
  Up: { newDirection: { x: 0, y: -1 }, axis: 'x', counterClockwise: true, border: "top" },
  Down: { newDirection: { x: 0, y: 1 }, axis: 'x', counterClockwise: false, border: "bottom" },
  Left: { newDirection: { x: -1, y: 0 }, axis: 'y', counterClockwise: false, border: "left" },
  Right: { newDirection: { x: 1, y: 0 }, axis: 'y', counterClockwise: true, border: "right" },
}

export let isControlsOn = false;

const changeRotation = (axis, counterClockwise) => {
  const TURN_ROTATION = 0.25;
  let clockwiseCorrection = counterClockwise === true ? -1 : 1;

  updateHeadRotation(Math.sign(Snake.direction[axis]) * TURN_ROTATION * clockwiseCorrection); 
}

const isAllowTurn = (axis, border) => {
  const oppositeAxis = axis === 'x' ? 'y' : 'x'; 
  const isSnakeMovingAlongBorder = headData[oppositeAxis] === boardBounds[border];

  return !isSnakeMovingAlongBorder && Math.abs(direction[axis]) === 1; 
}

const makeTurn = (newDirection) => {
  direction.x = newDirection.x;
  direction.y = newDirection.y 
}

export default function handleInput(arrowKey) { 
  const turnKey = arrowKey.slice(5, arrowKey.length); 
  const config = TURN_CONFIGS[turnKey];

  if (isAllowTurn(config.axis, config.border)) {
    changeRotation(config.axis, config.counterClockwise);
    makeTurn(config.direction);

    isControlsOn = false; // prevent multiple turns in one step
  }
}


