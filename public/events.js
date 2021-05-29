let [nodes, layer, width] = [null, null, 0];

function getNode (elem) {
  return elem.id.includes('day') ? nodes[0] : nodes[1];
}

function handleInput (e) {
  const node = getNode(e.target);
  const align = node.align();
  node.text(e.target.value);

  if (align === 'center') {
    node.offsetX(node.width() / 2);
  } else if (align === 'right') {
    node.offsetX(node.width());
  }
  layer.draw();
}

function handleSize (e) {
  const node = getNode(e.target);
  const align = node.align();
  node.fontSize(e.target.value);

  if (align === 'center') {
    node.offsetX(node.width() / 2);
  } else if (align === 'right') {
    node.offsetX(node.width());
  }
  layer.draw();
}

function handleStyle (e) {
  const node = getNode(e.target);
  const isActive = e.target.classList.toggle('active');
  if (isActive) {
    node.fontStyle('bold');
  } else {
    node.fontStyle('normal');
  }
  layer.draw();
}

function handleAlign (e) {
  const node = getNode(e.target.parentElement);
  if (e.target.tagName === 'BUTTON') {
    const currentActive = this.querySelector('.active');
    currentActive.classList.remove('active');
    e.target.classList.add('active');

    const align = e.target.dataset.value;
    if (align === 'left') {
      node.x(10);
      node.offsetX(0);
    } else if (align === 'center') {
      node.x(width / 2);
      node.offsetX(node.width() / 2);
    } else if (align === 'right') {
      node.x(width - 10);
      node.offsetX(node.width())
    }

    node.align(align);
    layer.draw();
  }
}

function handleShadow (e) {
  const node = getNode(e.target);
  node.shadowEnabled(e.target.checked);
  layer.draw();
}

function handleShadowOpacity (e) {
  const node = getNode(e.target);
  node.shadowOpacity(e.target.value/100);
  layer.draw();
}

function handleShadowX (e) {
  const node = getNode(e.target);
  node.shadowOffsetX(e.target.value);
  layer.draw();
}

function handleShadowY (e) {
  const node = getNode(e.target);
  node.shadowOffsetY(e.target.value);
  layer.draw();
}

function handleShadowBlur (e) {
  const node = getNode(e.target);
  node.shadowBlur(e.target.value);
  layer.draw();
}

function handleShadowColor (e) {
  const node = getNode(e.target);
  node.shadowColor(e.target.value);
  layer.draw();
}

export function addTextEvents (elements, _nodes, _layer, _width) {
  nodes = _nodes;
  layer = _layer;
  width = _width;

  for (let i = 0; i < nodes.length; i++) {
    const element = elements[i];
    document.getElementById(`${element}-input`).addEventListener('keyup', handleInput);
    document.getElementById(`${element}-size`).addEventListener('change', handleSize);
    document.getElementById(`${element}-style`).addEventListener('click', handleStyle);
    document.getElementById(`${element}-align`).addEventListener('click', handleAlign);
    document.getElementById(`${element}-shadow`).addEventListener('click', handleShadow);
    document.getElementById(`${element}-shadow-opacity`).addEventListener('input', handleShadowOpacity);
    document.getElementById(`${element}-shadow-x`).addEventListener('input', handleShadowX);
    document.getElementById(`${element}-shadow-y`).addEventListener('input', handleShadowY);
    document.getElementById(`${element}-shadow-blur`).addEventListener('input', handleShadowBlur);
    document.getElementById(`${element}-shadow-color`).addEventListener('input', handleShadowColor);
    
    nodes[i].on('dblclick dbltap', function () {
      document.getElementById(`${element}-input`).focus();
    });  
  }
}

export function removeTextEvents (elements) {
  for (let i = 0; i < nodes.length; i++) {
    const element = elements[i];
    document.getElementById(`${element}-input`).removeEventListener('keyup', handleInput);
    document.getElementById(`${element}-size`).removeEventListener('change', handleSize);
    document.getElementById(`${element}-style`).removeEventListener('click', handleStyle);
    document.getElementById(`${element}-align`).removeEventListener('click', handleAlign);
    document.getElementById(`${element}-shadow`).removeEventListener('click', handleShadow);
    document.getElementById(`${element}-shadow-opacity`).removeEventListener('input', handleShadowOpacity);
    document.getElementById(`${element}-shadow-x`).removeEventListener('input', handleShadowX);
    document.getElementById(`${element}-shadow-y`).removeEventListener('input', handleShadowY);
    document.getElementById(`${element}-shadow-blur`).removeEventListener('input', handleShadowBlur);
    document.getElementById(`${element}-shadow-color`).removeEventListener('input', handleShadowColor);

    nodes[i].off('dblclick dbltap');
  }
}
