import { direction, headData, updateHeadRotation } from "./snake.js";
import { data as boardData } from "../board.js";


export let isControlsOn = false;

const TURN_ROTATION = 0.25;
const TURN_CONFIGS = {
  Up: { newDirection: { x: 0, y: -1 }, axis: 'x', counterClockwise: true, border: "top" },
  Down: { newDirection: { x: 0, y: 1 }, axis: 'x', counterClockwise: false, border: "bottom" },
  Left: { newDirection: { x: -1, y: 0 }, axis: 'y', counterClockwise: false, border: "left" },
  Right: { newDirection: { x: 1, y: 0 }, axis: 'y', counterClockwise: true, border: "right" },
}

export function handleControls(arrowKey) {
  const turnKey = arrowKey.slice(5, arrowKey.length); 
  const { newDirection, axis, counterClockwise, border } = TURN_CONFIGS[turnKey];

  const oppositeAxis = axis === 'x' ? 'y' : 'x'; 
  const isSnakeMovingAlongBorder = headData[oppositeAxis] === boardData[border];
  const isTurnAngle90Deg = Math.abs(direction[axis]) === 1;

  if (!isSnakeMovingAlongBorder && isTurnAngle90Deg) {
    const clockwiseCorrection = counterClockwise === true ? -1 : 1;
    const newHeadRotation = TURN_ROTATION * Math.sign(direction[axis]) * clockwiseCorrection;
    updateHeadRotation(newHeadRotation); 

    direction.x = newDirection.x;
    direction.y = newDirection.y;

    isControlsOn = false; // Prevent multiple turns in one step.
  }
}






