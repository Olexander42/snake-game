const root = document.documentElement;
const html = document.querySelector("html");
const backgroundEl = document.querySelector(".background");
const containerEl = document.querySelector(".container");
const borderEl = document.querySelector(".border");
const snakeDiv = document.querySelector(".snake");
const foodEl = document.querySelector(".foodEl");
const scoreEl = document.querySelector(".score");
const recordEl = document.querySelector(".record");

const buttons = { 
                  start: document.querySelector(".start-btn"),
                  settings: document.querySelector(".settings-btn"),
                  size: document.getElementById("size"),
                };     


export { root, html, backgroundEl, containerEl, borderEl, snakeDiv, foodEl scoreEl, recordEl, buttons }