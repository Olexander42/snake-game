import { getDirection, setDirection, getHeadCoords, setHeadRotation, getBorders } from "./data.js";


export let isControlsOn = true;

const TURN_ROTATION = 0.25;
const TURN_CONFIGS = {
  Up: { newDirection: { x: 0, y: -1 }, axis: 'x', counterClockwise: true, border: "top" },
  Down: { newDirection: { x: 0, y: 1 }, axis: 'x', counterClockwise: false, border: "bottom" },
  Left: { newDirection: { x: -1, y: 0 }, axis: 'y', counterClockwise: false, border: "left" },
  Right: { newDirection: { x: 1, y: 0 }, axis: 'y', counterClockwise: true, border: "right" },
}

export function handleKeydown(button) {
  const isArrowButton = button.slice(0, 5) === "Arrow";
  if (!isControlsOn || !isArrowButton) return;

  const turnKey = button.slice(5, button.length);
  const { newDirection, axis, counterClockwise, border } = TURN_CONFIGS[turnKey];
 
  if (isAllowTurn(axis, border)) {
    changeHeadRotation(counterClockwise, axis);

    const { x, y } =  newDirection;
    setDirection(x, y);
    
    isControlsOn = false; // Prevent multiple turns in one step.
  }
}

export const turnOnControls = () => isControlsOn = true;

function isAllowTurn(axis, border) {
  const oppositeAxis = axis === "x" ? "y" : "x";

  const isSnakeMovingAlongBorder = getHeadCoords()[oppositeAxis] === getBorders()[border];
  const isTurnAngle90Deg = Math.abs(getDirection()[axis]) === 1;

  return !isSnakeMovingAlongBorder && isTurnAngle90Deg
}

function changeHeadRotation(counterClockwise, axis) {
  const clockwiseCorrection = counterClockwise === true ? -1 : 1;
  const turn = TURN_ROTATION * Math.sign(getDirection()[axis]) * clockwiseCorrection;
  
  setHeadRotation(turn);
}


















