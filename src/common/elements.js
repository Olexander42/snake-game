const root = document.documentElement;
const html = document.querySelector('html');
const body = document.querySelector('body');
const container = document.querySelector("#container");
const background = document.querySelector("#background");
const border = document.querySelector("#border");
const menu = document.querySelector("#menu");
const settingsDiv = document.querySelector("#settings-menu");
const startBtn = document.getElementById("start-btn");
const settingsBtn = document.getElementById("settings-btn");
const sizeInput = document.querySelector("#size-slider");
const style = document.querySelector('style');
const soundIcon = document.querySelector("#sound-icon");


export { 
  root,
  html,
  body,
  container,
  background,
  border,
  menu,
  settingsDiv,
  startBtn,
  settingsBtn,
  sizeInput,
  style,
  soundIcon
}