buttons.size.addEventListener('input', () => {
  reset();
  sizes.width = Math.floor(buttons.size.value / 2) * 2;
  sizes.step = sizes.width / 2;
  root.style.setProperty("--sizes.width", `${sizes.width}px`);
  borderSize("ini");
  game = new SnakeGame();
})
