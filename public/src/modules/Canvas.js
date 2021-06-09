import { fitStageIntoParentContainer } from "../utils.js";
import Defaults from "./Defaults.js";
import State from "./State.js";

function init (type) {
  const font = new FontFaceObserver(State.get('font'));
  font.load().then(function () {
    State.get('texts').forEach(function (text) {
      const margin = State.get('width') * 0.05;   // 5% margin
      if (text.align() === 'left') {
        text.x(margin);
      } else if (text.align() === 'center') {
        text.x(State.get('width') / 2);
      } else if (text.align() === 'right') {
        text.x(State.get('width') - margin);
      }
    });

    const stage = new Konva.Stage({
      container: 'image-container',
      width: State.get('width'),
      height: State.get('height'),
    });
  
    const layer = new Konva.Layer();
  
    State.set('stage', stage);
    State.set('layer', layer);
  
    stage.add(layer);
  
    const imageObj = new Image();
    imageObj.src = `imgs/EJ-${type}.jpg`;
  
    imageObj.onload = function () {
      document.getElementById('image-container').classList.remove('loader');
      const bg = new Konva.Image({
        x: 0,
        y: 0,
        image: imageObj,
        width: State.get('width'),
        height: State.get('height'),
        listening: false
      });
  
      // add the shape to the layer
      layer.add(bg);
  
      if (State.get('texts').length > 0) {
        drawTexts();
      } else {
        layer.draw();
      }
  
    };
  
    fitStageIntoParentContainer();
  });
}

function addText () {
  const layer = State.get('layer');
  const text = new Konva.Text({ ...Defaults() });
  text.offsetX(text.width() / 2);

  State.get('texts').push(text);
  verticalDrag(text);
  layer.add(text);
  layer.draw();
  return text;
}

function removeText (text) {
  text.remove();
  text = null;
  State.get('layer').draw();
}

function drawTexts () {
  const layer = State.get('layer');
  State.get('texts').forEach(function (text) {
    text.y(State.get('height') / 2);
    layer.add(text);
    layer.draw();
  });
}

function verticalDrag (node) {
  node.dragBoundFunc(function(pos){
    const stage = State.get('stage');
    // important pos - is absolute position of the node
    // you should return absolute position too
    const maxY = stage.height() - node.getClientRect().height;
    return {
      x: this.absolutePosition().x,
      y: (pos.y < 0 ? 0 : pos.y > maxY ? maxY : pos.y)
    };
  });
}

export default { init, addText, removeText, drawTexts }