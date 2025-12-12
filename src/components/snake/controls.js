import { direction, headCoords, setHeadRotation, getBoardData } from "./snake.js";


export let isControlsOn = true;

const TURN_ROTATION = 0.25;
const TURN_CONFIGS = {
  Up: { newDirection: { x: 0, y: -1 }, axis: 'x', counterClockwise: true, border: "top" },
  Down: { newDirection: { x: 0, y: 1 }, axis: 'x', counterClockwise: false, border: "bottom" },
  Left: { newDirection: { x: -1, y: 0 }, axis: 'y', counterClockwise: false, border: "left" },
  Right: { newDirection: { x: 1, y: 0 }, axis: 'y', counterClockwise: true, border: "right" },
}

export function handleKeydown(button) {
  if (!isControlsOn || button.slice(0, 5) !== "Arrow") return; // Work only with "Arrow" buttons.

  const turnKey = button.slice(5, button.length); 
  const { newDirection, axis, counterClockwise, border } = TURN_CONFIGS[turnKey];
 
  if (isAllowTurn(axis, border)) {
    changeHeadRotation(counterClockwise, axis);
    changeDirection(newDirection);
    
    isControlsOn = false; // Prevent multiple turns in one step.
  }
}

export const turnOnControls = () => isControlsOn = true;

function isAllowTurn(axis, border) {
  const oppositeAxis = axis === "x" ? "y" : "x";

  const isSnakeMovingAlongBorder = headCoords[oppositeAxis] === getBoardData()[border]; // TODO: clarify this.
  const isTurnAngle90Deg = Math.abs(direction[axis]) === 1;

  return !isSnakeMovingAlongBorder && isTurnAngle90Deg
}

function changeDirection(newDir) {
  direction.x = newDir.x;
  direction.y = newDir.y; 
}

function changeHeadRotation(ccw, axis) {
  const clockwiseCorrection = ccw === true ? -1 : 1;
  const turn = TURN_ROTATION * Math.sign(direction[axis]) * clockwiseCorrection;
  
  setHeadRotation(turn);
}


















