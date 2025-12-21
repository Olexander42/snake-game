export const contexts = {};

export let context;
export const addContext = (ctxInst) => contexts[ctxInst.name] = ctxInst;
export const setContext = (ctxName) => {
  context = contexts[ctxName];
  //context.resetFocus();
  console.log("current context:", context.name);
}
export const getContext = (ctxName) => contexts[ctxName];

export class Context {
  static DIRECTIONS = {
    vertical: {
      Up: -1,
      Down: 1
    },

    horizontal: {
      Left: -1,
      Right: 1
    }
  }

  static DELAY = 200;

  constructor(name, selector, alignment = "vertical") {
    this.name = name;
    this.focusibleElements = [...document.querySelectorAll(`${selector}, #sound-icon`)];
    this.allowedDirs = Context.DIRECTIONS[alignment];
    this.focusedEl = null;
  }

  moveFocus(direction) {
    const increment = this.allowedDirs[direction];
    if (!increment) return;

    const INDEX_MIN = 0;
    const INDEX_MAX = this.focusibleElements.length - 1;
    
    const focusedElIndex = this.focusibleElements.indexOf(this.focusedEl); 
    const newIndex = focusedElIndex + increment;

    const newIndexSafe = Math.max(Math.min(newIndex, INDEX_MAX), INDEX_MIN); 
    console.log("inside moveFocus()");
    this.setFocus(this.focusibleElements[newIndexSafe]);
  }

  setFocus(el) {
    this.focusedEl = el;
    this.focusedEl.focus();

    console.log("FocusedEl:", this.focusedEl);
  }

  resetFocus() {
    this.setFocus(this.focusibleElements[0]);
  }

  emulateClick() {
    this.focusedEl.classList.add("active");  // emulate active state
    setTimeout(() => {
      this.focusedEl.classList.remove("active");
      this.focusedEl.click();
    }, Context.DELAY);
  }
}

export class SubContext extends Context {
  static initFocusibleElements(parent) {
    const rearSide = parent.children[1];
    const fieldsetId = rearSide.firstElementChild.id;

    return [...document.querySelectorAll(`#${fieldsetId} [tabindex = '0']`)];
  }

  constructor(name, parent, alignment = "horizontal") {
    super(name);
    this.focusibleElements = SubContext.initFocusibleElements(parent);
    this.allowedDirs = Context.DIRECTIONS[alignment];
    this.focusedEl = null;
  }
}