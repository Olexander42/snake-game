export default class Outline {
  constructor(fieldsetId, recipient=undefined) {
    this.fieldset = document.querySelector(fieldsetId);
    this.element = document.querySelector(`${fieldsetId} .outline`);
    this.recipient = recipient;

    this._attachInternalTransitionListeners();
    this._moveToChecked();
  }

  _moveToChecked() {
    requestAnimationFrame(() => { // give time for :checked to update
      const checked = document.querySelector(`#${this.fieldset.id} input:checked + span`);
      const newLeft = checked.offsetLeft;
      this.element.style.left = `${newLeft}px`;
    })
  }

  _attachInternalTransitionListeners() {
    // native CSS outline replaces disappeared outline element and vice versa 
    // because of possible layout shifts 
    this.element.addEventListener('transitionstart', () => {
      this.element.style.opacity = 1;
    })

    this.element.addEventListener('transitionend', () => {
      this.element.style.opacity = 0;
      this.fieldset.style.setProperty("--checked-outline", '4px solid var(--white)') 
    })
  }

  attachTo(elements) {
    [...elements].forEach((element) => element.addEventListener('click', (event) => { 
      this.fieldset.style.setProperty("--checked-outline", 'none'); // hide CSS outline asap to avoid flashes
      this._moveToChecked();

      if (this.recipient) this.recipient(event.currentTarget.value);
    }));
  }
}