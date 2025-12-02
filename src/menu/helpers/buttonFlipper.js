import { body, settingsDiv } from "../../../common/elements.js";


function flipButton(event) {
  const side = event.currentTarget;  
  const button = side.parentElement;
  const fieldsets = [...document.querySelectorAll('fieldset')];
  
  if (
    (!(side.classList.contains("rear") && event.target !== side)) // ignore children on rear side
    || fieldsets.includes(event.target) // but don't ignore <fieldset>
  )  {   
    button.classList.toggle("clicked"); 
  }
}

function closeButtons(event) { 
  if (event.target === event.currentTarget || settingsDiv === event.target) { // if clicked anywhere outside the buttons
    [...document.querySelectorAll(".clicked")].forEach((clickedButton) => clickedButton.classList.remove("clicked"));
  }
}

export default function attachTo(elements) {
  elements.forEach((element) => element.addEventListener('click', flipButton));
  body.addEventListener('click', closeButtons);
}
