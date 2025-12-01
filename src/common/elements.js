const getElement = (() => {
  let root =         null;
  let html =         null;
  let body =         null;
  let container =    null;
  let background =   null;
  let border =       null;
  let menu =         null;
  let settingsDiv =  null;
  let startBtn =     null;
  let settingsBtn =  null;
  let sizeInput =    null;
  let style =        null;
  let soundIcon =    null;

  return {
    root:         () => root         ||=document.documentElement,
    html:         () => html         ||=document.querySelector('html'),
    body:         () => body         ||=document.querySelector('body'),
    container:    () =>  container   ||=document.querySelector("#container"),
    background:   () => background   ||=document.querySelector("#background"),
    border:       () => border       ||=document.querySelector("#border"),
    menu:         () => menu         ||=document.querySelector("#menu"),
    settingsDiv:  () => settingsDiv  ||=document.querySelector("#settings-menu"),
    startBtn:     () => startBtn     ||=document.querySelector("#start-btn"),
    settingsBtn:  () => settingsBtn  ||=document.querySelector("#settings-btn"),
    sizeInput:    () => sizeInput    ||=document.querySelector("#size-slider"),
    style:        () => style        ||=document.querySelector('style'),
    soundIcon:    () => soundIcon    ||=document.querySelector("#sound-icon"),
  }
})();

export default getElement;