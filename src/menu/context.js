 const contexts = {};

export let context;
export const addContext = (ctxInst) => contexts[ctxInst.name] = ctxInst;
export const getContext = (ctxName) => contexts[ctxName];

export function switchContext(ctxName) {
  const prevCtx = context;
  context = contexts[ctxName];

  if (isOptionsCtx(context)) context.focusChecked();
  else if ((isOptionsCtx(prevCtx)) && context.name === "settings menu") {
    context.focusedEl.focus();
  } else {
    context.focusedEl = null;
  }
  console.log("current context:", context.name);
}

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

    this.setFocus(this.focusibleElements[newIndexSafe]);
  }

  setFocus(el) {
    this.focusedEl = el;
    this.focusedEl.focus();
  }
}

export class OptionsButton extends Context {
  constructor(name, parent, alignment = "horizontal") {
    super(name);
    this.fieldsetId = parent.children[1].firstElementChild.id;
    this.focusibleElements = [...document.querySelectorAll(`#${this.fieldsetId} [tabindex = '0']`)];
    this.allowedDirs = Context.DIRECTIONS[alignment];
    this.inputType = document.querySelector(`#${this.fieldsetId} input`).type;
    this.focusedEl = null;
  }

  focusChecked() {
    if (this.inputType === 'radio') {
      const checked = document.querySelector(`#${this.fieldsetId} input:checked + span`);
      this.setFocus(checked);
    } else if (this.inputType === 'range') {
        this.input = this.input ??= document.querySelector(`#${this.fieldsetId} input`);
        this.options = this.options ??= [...document.querySelectorAll(`#${this.fieldsetId} input + datalist option`)];

        for (const option of this.options) {
          if (option.value === this.input.value) {
            this.focusedEl = option;
            break;
          }
        }
    }
  }
}

const isOptionsCtx = (ctx) => ctx instanceof OptionsButton;