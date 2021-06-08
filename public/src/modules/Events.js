import formats from "../formats-config.js";
import { fitStageIntoParentContainer, findParentBySelector } from "../utils.js";
import Canvas from "./Canvas.js";
import State from "./State.js";
import Template from "./Template.js";

function init () {
  // adapt the stage on any window resize
  window.addEventListener('resize', fitStageIntoParentContainer);

  // CLICK ON ADD TEXT BUTTON
  document.getElementById('add-text').addEventListener('click', function () {
    const elem = Template.clone();
    const textNode = Canvas.addText();
    
    elem.querySelectorAll('.collapse-toggle').forEach(function (el) {
      el.addEventListener('click', function() {
        this.classList.toggle('active');
        const content = this.nextElementSibling;
        if (content.style.display === 'flex') {
          content.style.display = 'none';
        } else {
          content.style.display = 'flex';
        }
      });
    });

    bindElemToNode(elem, textNode);
  });

  // Format changing
  document.getElementById('format').addEventListener('change', function (e) {
    document.querySelectorAll('div[data-index]').forEach(function (elem) {
      const nodes = State.get('texts');
      for (let i = 0; i < nodes.length; i++) {
        nodes[i].remove();
      }    
    });

    const stage = State.get('stage');
    const imgType = e.target.value;
    State.merge(formats[imgType]);
    State.set('imgType', imgType);
    
    // Needs to reset texts position/offset, since width/height have changed
    State.get('texts').forEach(function (text) {
      if (text.align === 'center') {
       text.x = State.get('width') / 2;
      } else if (text.align === 'right') {
        text.x = State.get('width') - 10;
      }
    });

    stage.destroy();
    document.getElementById('image-container').classList.add('loader');

    Canvas.init(imgType);
  
    if (imgType === 'panfleto') {
      document.getElementById('save-pdf').classList.remove('hide');
    } else {
      document.getElementById('save-pdf').classList.add('hide');
    }
  });
}

function bindElemToNode (elem, node) {
  elem.querySelector(`.text-input`).addEventListener('keyup', handleInput);
  elem.querySelector(`.text-size`).addEventListener('change', handleSize);
  elem.querySelector(`.text-color`).addEventListener('input', handleColor);
  elem.querySelector(`.text-style`).addEventListener('click', handleStyle);
  elem.querySelector(`.text-align`).addEventListener('click', handleAlign);
  elem.querySelector(`.text-shadow`).addEventListener('click', handleShadow);
  elem.querySelector(`.text-shadow-opacity`).addEventListener('input', handleShadowOpacity);
  elem.querySelector(`.text-shadow-x`).addEventListener('input', handleShadowX);
  elem.querySelector(`.text-shadow-y`).addEventListener('input', handleShadowY);
  elem.querySelector(`.text-shadow-blur`).addEventListener('input', handleShadowBlur);
  elem.querySelector(`.text-shadow-color`).addEventListener('input', handleShadowColor);
  
  node.on('dblclick dbltap', function () {
    elem.querySelector(`.text-input`).focus();
  });  

}

function getCanvasNode (elem) {   // returns the day node or the address node from the canvas
  const container = findParentBySelector(elem, 'div[data-index]');
  return State.get('texts')[container.dataset.index];
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