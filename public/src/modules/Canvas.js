import { fitStageIntoParentContainer } from "../utils.js";
import Defaults, { unsets } from "./Defaults.js";
import { addTextEvents } from "./Events.js";
import State from "./State.js";

function init (type) {
  State.set('stage', new Konva.Stage({
    container: 'image-container',
    width: State.get('width'),
    height: State.get('height'),
  }));

  State.set('layer', new Konva.Layer());
  const stage = State.get('stage');
  const layer = State.get('layer');

  stage.add(layer);

  document.getElementById('day-size').value = State.get('day.size');
  document.getElementById('address-size').value = State.get('address.size');

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
    layer.draw();
    drawText();
  };

  fitStageIntoParentContainer();
}
function drawText () {
  const layer = State.get('layer');

  const dayText = new Konva.Text({ ...Defaults().day });
  // Fill state fields which aren't set yet
  unsets().day.forEach(function (key) {
    State.set(`day.${key}`, dayText[key]());
  });

  if (State.get('day.offsetX') === undefined) State.set('day.offsetX', dayText.width() / 2);

  const addressText = new Konva.Text({ ...Defaults().address });
  unsets().address.forEach(function (key) {
    State.set(`address.${key}`, addressText[key]());
  });

  if (State.get('address.offsetX') === undefined) State.set('address.offsetX', addressText.width() / 2);

  const font = new FontFaceObserver(State.get('font'));
  font.load().then(function () {
    dayText.fontFamily(State.get('font'));
    addressText.fontFamily(State.get('font'));

    if (State.get('day.align') === 'center') {
      State.set('day.offsetX', dayText.width() / 2);
    } else if (State.get('day.align') === 'right') {
      State.set('day.offsetX', dayText.width());
    }
  
    if (State.get('address.align') === 'center') {
      State.set('address.offsetX', addressText.width() / 2);
    } else if (State.get('address.align') === 'right') {
      State.set('address.offsetX', addressText.width());
    }

    dayText.offsetX(State.get('day.offsetX'));
    addressText.offsetX(State.get('address.offsetX'));
    layer.draw();
  });

  addTextEvents(['day', 'address'], [dayText, addressText], layer, State.get('width'));
  verticalDrag(dayText);
  verticalDrag(addressText);

  layer.add(dayText);
  layer.add(addressText);
  layer.draw();
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

export default { init }