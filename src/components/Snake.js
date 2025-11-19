import { roundTo } from '../common/utils.js';
import { root, container } from "../common/elements.js";


class Snake {
  constructor() {
    this.div = document.createElement('div');
    this.div.id = "snake";
    container.append(this.div);
  }

  spawn(bounds, color) {
    this.bounds = bounds;
    
    // parameters
    this.speed = 1;
    this.direction = {"x": 1, "y": 0};
    this.turn = 0;
    this.color = new Color(color);

    // body 
    this._createSection(this.bounds.center.x, this.bounds.center.y, this.color.changedColor({l: -2}), "head") ; 
    this._createSection(this.bounds.center.x - this.bounds.step, this.bounds.center.y, this.color.string, "neck"); 

    this.head = document.getElementById("head");
    this.neck = document.getElementById("neck");

    this.head.style.scale = `${1}`;
    this.neck.style.scale = `${0.75}`;

    this._snapshot();
    this.moveHead();
  }

  _createSection(x, y, color, id="") {
    const element  = document.createElement('span');

    element.classList.add("block");
    element.classList.add(`${"snake-body"}`);
    element.id = id;

    element.style.left = `${x}px`;
    element.style.top = `${y}px`;
    element.style.backgroundColor = color;

    this.div.append(element);
  }

  _snapshot() {
    this.body = [...document.querySelectorAll(".snake-body")];
    this.bodyData = [];

    this.body.forEach((section) => {
      const [x, y, rotate] = [parseInt(section.style.left), parseInt(section.style.top), section.style.rotate];
      const data = {x, y, rotate};

      this.bodyData.push(data);
    })
  }

  moveHead() {   
    this._snapshot();

    const head = this.bodyData[0]; 

    const [currentX, currentY] = [head.x, head.y]

    const stepX = Math.sign(this.direction.x) * this.bounds.step;
    const stepY = Math.sign(this.direction.y) * this.bounds.step;

    const newX = currentX + stepX;
    const newY = currentY + stepY;

    this.head.style.left = newX + 'px';
    this.head.style.top = newY + 'px';
    this.head.style.rotate = `${this.turn}turn`;
  }
}
/*



  bodyFollows() {
    let i = 1; // because this.body[0] is head

    const moveToNextSection = (i) => {
      const nextSection = this.bodyData[i - 1];
      const currentSection = this.body[i];

      currentSection.style.left = nextSection.x + 'px';
      currentSection.style.top = nextSection.y + 'px';
      currentSection.style.rotate = nextSection.rotate;

      if (i < this.body.length - 1) moveToNextSection(i + 1);
    }

    moveToNextSection(i);
  }

  repaintBody() { // under construction to work with RAF
    /*
    let i = 0;
    const repaintSection = (i) => {
      const lighterColor = changedColor(this.color.hsl, {l: i});
      const section = this.body[i];

      section.style.backgroundColor = lighterColor;

      i++;
  }

  lengthen() {
    this._snapshot(); // test without it

    const oldTail = this.body[this.body.length - 1];
    if (oldTail.id === "tail") oldTail.id = "";

    this.tail = oldTail.cloneNode(false);
    this.tail.id = "tail";
    this.tail.style.zIndex = `-${this.body.length}`
    this.div.append(this.tail);

    this._rescaleBody();
    this._repaintTail();
  }

  collision() {
    const head = this.body[0];
    const clip = parseInt(root.getPropertyValue("--clip"));

    return (
      head.x < clip // left border
      || head.x > container.clientWidth - clip - this.bounds.step // right border
      || head.y < clip // top border
      || head.y > container.clientHeight - clip - this.bounds.step // bottom border
      || isCoordsInsideArray(head.x, head.y, this.bodyData);
    ) 
  }

  _repaintTail() {
    const lighterColor = changedColor(this.color.hsl , {l: this.body.length});
    this.tail.style.backgroundColor = lighterColor;
  }

  _rescaleBody() {
    this._snapshot(); // try move it outside

    const length = this.body.length;
    let i = length - 1;
    let j = 1; 
    let scale = 0;

    const rescaleSection = () => { 
      // rescale from tail to neck
      scale += 1 / (2 ** j); 
      snake.body[i].style.scale = `${roundTo(scale, 2)}`;
      i--;
      j++;
      if (i > 0) rescaleSection();  
    }

    rescaleSection();
  }
}
*/

class Color { // only works with hsl
  constructor(color) { 
    this.string = color;
    this.hslComponents = this._colorComponents();
  }

  _colorComponents() { 
    const hslValues = this.string.match(/\d+/g).map(Number);
    const hslComponents = {h: hslValues[0], s: hslValues[1], l: hslValues[2]};

    return hslComponents;
  }

  changedColor({changeH = 0, changeS = 0, changeL = 0} = {}) {
    const h = this.hslComponents.h + changeH;
    const s = this.hslComponents.s + changeS;
    const l = this.hslComponents.l + changeL;

    const newColor = `hsl(${h}, ${s}%, ${l}%)`

    return newColor;
  }
}



export default Snake;