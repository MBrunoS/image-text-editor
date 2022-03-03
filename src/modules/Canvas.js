import { fitStageIntoParentContainer } from "../utils.js";
import Defaults from "./Defaults.js";
import State from "./State.js";

function init(imageSrc = null) {
  const font = new FontFaceObserver(State.get("font"));
  font.load().then(function () {
    State.get("texts").forEach(function (text) {
      const margin = State.get("width") * 0.05; // 5% margin

      if (text.align() === "left") {
        text.x(margin);
      } else if (text.align() === "center") {
        text.offsetX(text.width() / 2);
        text.x(State.get("width") / 2);
      } else if (text.align() === "right") {
        text.offsetX(text.width());
        text.x(State.get("width") - margin);
      }
    });

    const stage = new Konva.Stage({
      container: "image-container",
      width: State.get("width"),
      height: State.get("height"),
    });

    const layer = new Konva.Layer();

    State.set("stage", stage);
    State.set("layer", layer);

    stage.add(layer);

    const imageObj = new Image();
    imageObj.src = imageSrc ?? `imgs/default.jpg`;

    imageObj.onload = function () {
      document.getElementById("image-container").classList.remove("loader");
      const bg = new Konva.Image({
        x: 0,
        y: 0,
        image: imageObj,
        width: State.get("width"),
        height: State.get("height"),
        listening: false,
      });

      // add the shape to the layer
      layer.add(bg);

      if (State.get("texts").length > 0) {
        drawTexts();
      } else {
        layer.draw();
      }
    };

    fitStageIntoParentContainer();
  });
}

function addText() {
  const layer = State.get("layer");
  const text = new Konva.Text({ ...Defaults() });
  text.offsetX(text.width() / 2);

  State.get("texts").push(text);
  nodeMovements(text, "vertical");
  layer.add(text);
  layer.draw();
  return text;
}

function removeText(text) {
  text.remove();
  text = null;
  State.get("layer").draw();
}

function drawTexts() {
  const layer = State.get("layer");
  State.get("texts").forEach(function (text) {
    text.y(State.get("height") / 2);
    layer.add(text);
    layer.draw();
  });
}

export function nodeMovements(node, dragMode) {
  node.dragBoundFunc(function (pos) {
    const stage = State.get("stage");
    const align = node.align();
    let maxX,
      minX = node.offsetX();

    if (align === "left") {
      minX = 0;
      maxX = stage.width() - node.getClientRect().width;
    } else if (align === "center") {
      minX = node.getClientRect().width / 2;
      maxX = stage.width() - node.getClientRect().width / 2;
    } else if (align === "right") {
      minX = node.getClientRect().width;
      maxX = stage.width();
    }

    const maxY = stage.height() - node.getClientRect().height;

    if (dragMode === "vertical") {
      return {
        x: this.absolutePosition().x,
        y: pos.y < 0 ? 0 : pos.y > maxY ? maxY : pos.y,
      };
    } else if (dragMode === "horizontal") {
      return {
        x: pos.x < minX ? minX : pos.x > maxX ? maxX : pos.x,
        y: this.absolutePosition().y,
      };
    } else if (dragMode === "free") {
      return {
        x: pos.x < minX ? minX : pos.x > maxX ? maxX : pos.x,
        y: pos.y < 0 ? 0 : pos.y > maxY ? maxY : pos.y,
      };
    }
  });
}

export default { init, addText, removeText, drawTexts, nodeMovements };
