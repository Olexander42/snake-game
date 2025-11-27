import getElement from "../common/elements.js";


function setTheme(theme) {
  const html = getElement.html();
  const border = getElement.border();
  const background = getElement.background();
  const style = getElement.style();

  html.style.setProperty('background-image', `url(./assets/${theme}/images/outside.jpg)`);
  border.style.setProperty('border-image-source', `url(./assets/${theme}/images/border.jpg)`);
  background.style.setProperty('background-image', `url(./assets/${theme}/images/inside.jpg)`);

  style.innerHTML = `
    @font-face {
      font-family: "main";
      src: url("./assets/${theme}/fonts/main.woff2") format('woff2');
    }

    @font-face {
      font-family: "secondary";
      src: url("./assets/${theme}/fonts/secondary.woff2") format('woff2');
    }

    @font-face {
      font-family: "score";
      src: url("./assets/${theme}/fonts/score.woff2") format('woff2');
    }
  `
}



/*

function offsetShrink() {
  // if snake inside top border
  if (snake.snakeBodyData.some((coord) => (parseInt(coord.top) < board.clip + board.step))) { // top border
    snake.snakeBody.forEach((el) => el.style.top = parseInt(el.style.top) + board.step + "px" );
  }

  // if snake inside bottom border
  if (snake.snakeBodyData.some((coord) => (parseInt(coord.top) > board.container.height - board.clip - board.thick))) { // bottom border
    snake.snakeBody.forEach((el) => el.style.top = parseInt(el.style.top) - board.step + "px" );
  }

  // if snake inside left border
  if (snake.snakeBodyData.some((coord) => (parseInt(coord.left) < board.clip + board.step))) { // left border
    snake.snakeBody.forEach((el) => el.style.left = parseInt(el.style.left) + board.step + "px" );
  }
  
  // if snake inside right border
  if (snake.snakeBodyData.some((coord) => (parseInt(coord.left) > board.container.width - board.clip - board.thick))) { // right border
    snake.snakeBody.forEach((el) => el.style.left = parseInt(el.style.left) - board.step + "px" );
  }
}
function isCoordsInsideArray(x, y, array) {
  return array.some((section, i) => (i !== 0 && (x === section.x && y === section.y)));
}

*/

export { setTheme };