import formats from "../formats-config.js";
import { fitStageIntoParentContainer, findParentBySelector } from "../utils.js";
import Canvas from "./Canvas.js";
import State from "./State.js";
import Template from "./Template.js";

function init () {
  // adapt the stage on any window resize
  window.addEventListener('resize', fitStageIntoParentContainer);

  // Events regarding texts "widgets" (adding, deleting, collapses)
  document.getElementById('texts-container').addEventListener('click', function(e) {
    // CLICK ON ADD TEXT BUTTON
    if (e.target.id === 'add-text') {
      const elem = Template.clone();
      const textNode = Canvas.addText();
      bindElemToNode(elem, textNode);
    }
    // TOGGLE COLLAPSES
    else if (e.target.className.includes('collapse-toggle')) {
      e.target.classList.toggle('active');
      const parent = findParentBySelector(e.target, '.collapsible');
      const content = parent.querySelector('.collapse-content');
      if (content.style.display === 'flex') {
        content.style.display = 'none';
      } else {
        content.style.display = 'flex';
      }
    }
    // DELETE BUTTONS
    else if (e.target.className.includes('i-delete')) {
      const texts = Array.from(this.querySelectorAll('.text-item'));
      const text = findParentBySelector(e.target, '.text-item');
      const index = texts.indexOf(text);
      let textNode = State.get('texts').splice(index, 1)[0];
      Canvas.removeText(textNode);
      textNode = null;
      text.remove();
    }
  });

  // Format changing
  document.getElementById('format').addEventListener('change', function (e) {
    const nodes = State.get('texts');
    for (let i = 0; i < nodes.length; i++) {
      nodes[i].remove();
    }

    const stage = State.get('stage');
    const imgType = e.target.value;
    State.merge(formats[imgType]);
    State.set('imgType', imgType);

    stage.destroy();
    document.getElementById('image-container').classList.add('loader');

    // Needs to reset texts position/offset, since width/height have changed
    State.get('texts').forEach(function (text) {
      text.fontFamily(State.get('font'));
    });

    Canvas.init(imgType);
  
    if (imgType === 'panfleto') {
      document.getElementById('save-pdf').classList.remove('hide');
    } else {
      document.getElementById('save-pdf').classList.add('hide');
    }
  });
}

function bindElemToNode (container, node) {
  container.querySelector(`[data-handle=input]`).addEventListener('keyup', handleInput);
  container.querySelector(`[data-handle=size]`).addEventListener('change', handleSize);
  container.querySelector(`[data-handle=color]`).addEventListener('input', handleColor);
  container.querySelector(`[data-handle=style]`).addEventListener('click', handleStyle);
  container.querySelector(`[data-handle=align]`).addEventListener('click', handleAlign);
  container.querySelector(`[data-handle=shadow]`).addEventListener('click', handleShadow);
  container.querySelector(`[data-handle=shadow-opacity]`).addEventListener('input', handleShadowOpacity);
  container.querySelector(`[data-handle=shadow-x]`).addEventListener('input', handleShadowX);
  container.querySelector(`[data-handle=shadow-y]`).addEventListener('input', handleShadowY);
  container.querySelector(`[data-handle=shadow-blur]`).addEventListener('input', handleShadowBlur);
  container.querySelector(`[data-handle=shadow-color]`).addEventListener('input', handleShadowColor);
  
  node.on('dblclick dbltap', function () {
    container.querySelector(`[data-handle=input]`).focus();
  });  

}

function getCanvasNode (elem) {   // returns the text node from the canvas
  const text = findParentBySelector(elem, '.text-item');
  const texts = Array.from(text.parentElement.querySelectorAll('.text-item'));
  const index = texts.indexOf(text);
  return State.get('texts')[index];
}

function handleInput (e) {
  const node = getCanvasNode(e.target);
  const align = node.align();
  node.text(e.target.value);

  if (align === 'center') {
    node.offsetX(node.width() / 2);
  } else if (align === 'right') {
    node.offsetX(node.width());
  }
  State.get('layer').draw();
}

function handleSize (e) {
  const node = getCanvasNode(e.target);
  const align = node.align();
  node.fontSize(e.target.value);

  if (align === 'center') {
    node.offsetX(node.width() / 2);
  } else if (align === 'right') {
    node.offsetX(node.width());
  }
  State.get('layer').draw();
}

function handleColor (e) {
  const node = getCanvasNode(e.target);
  node.fill(e.target.value);
  State.get('layer').draw();
}

function handleStyle (e) {
  const node = getCanvasNode(e.target);
  const isActive = e.target.classList.toggle('active');
  const align = node.align();
  
  if (isActive) {
    node.fontStyle('bold');
  } else {
    node.fontStyle('normal');
  }
  
  if (align === 'center') {
    node.offsetX(node.width() / 2);
  } else if (align === 'right') {
    node.offsetX(node.width());
  }
  
  State.get('layer').draw();
}

function handleAlign (e) {
  const node = getCanvasNode(e.target.parentElement);
  if (e.target.tagName === 'BUTTON') {
    const currentActive = this.querySelector('.active');
    currentActive.classList.remove('active');
    e.target.classList.add('active');

    const align = e.target.dataset.value;
    if (align === 'left') {
      node.x(10);
      node.offsetX(0);
    } else if (align === 'center') {
      node.x(State.get('width') / 2);
      node.offsetX(node.width() / 2);
    } else if (align === 'right') {
      node.x(State.get('width') - 10);
      node.offsetX(node.width())
    }
    
    node.align(align);
    State.get('layer').draw();
  }
}

function handleShadow (e) {
  const node = getCanvasNode(e.target);
  node.shadowEnabled(e.target.checked);
  State.get('layer').draw();
}

function handleShadowOpacity (e) {
  const node = getCanvasNode(e.target);
  node.shadowOpacity(e.target.value/100);
  State.get('layer').draw();
}

function handleShadowX (e) {
  const node = getCanvasNode(e.target);
  node.shadowOffsetX(e.target.value);
  State.get('layer').draw();
}

function handleShadowY (e) {
  const node = getCanvasNode(e.target);
  node.shadowOffsetY(e.target.value);
  State.get('layer').draw();
}

function handleShadowBlur (e) {
  const node = getCanvasNode(e.target);
  node.shadowBlur(e.target.value);
  State.get('layer').draw();
}

function handleShadowColor (e) {
  const node = getCanvasNode(e.target);
  node.shadowColor(e.target.value);
  State.get('layer').draw();
}

export default { init }