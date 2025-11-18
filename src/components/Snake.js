import { splitColor, changedColor, roundTo } from '../../common/utils.js';
import { root, container } from "../../common/elements.js";
import { center, size_unit.value } from "../../common/constants.js";
import { isCoordInsideArray } from "../../common/constants.js";


class Snake {
  constructor(board) {
    this.div = document.createElement('div');
    this.div.id = "snake";
    document.container.append(this.div);
  }

  init() {
    // parameters
    this.speed = 1;
    this.direction = {"x": 1, "y": 0};
    this.turn = 0;
    this.color = { string: document.querySelector('input[name="color-snake"]:checked').value };
    this.color.hsl = splitColor(this.color.string);

    // body 
    this._createSection(center.x, center.y, changedColor(this.color.hsl , {l: -2}), "head") ; 
    this._createSection(center.x - size_unit.value, center.y, this.color.string, "neck"); 
    this.head = document.getElementById("head");
    this.neck = document.getElementById("neck");
    this.head.style.scale = `${1}`;
    this.neck.style.scale = `${0.75}`;

    this._snapshot();
  }

  moveHead() {   
    this._snapshot();

    const head = this.body[0];
    const x = head.x + this.direction.x * size_unit.value;
    const y = head.y + this.direction.y * size_unit.value;

    this.head.style.left = x + 'px';
    this.head.style.top = y + 'px';
    this.head.style.rotate = `${this.turn}turn`;
  }

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
    */
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
      || head.x > container.clientWidth - clip - size_unit.value // right border
      || head.y < clip // top border
      || head.y > container.clientHeight - clip - size_unit.value // bottom border
      || isCoordsInsideArray(head.x, head.y, this.bodyData);
    ) 
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
    this.body.forEach((el) => {
      const [x, y, rotate] = [parseInt(el.style.left), parseInt(el.style.top), el.style.rotate];
      const data = {x, y, rotate};
      this.bodyData.push(data);
    })
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


export default Snake;