import { addTextEvents, removeTextEvents } from './modules/Events.js'
import formats from './formats-config.js'
import State from './modules/State.js'

let imgType = document.getElementById('format').value;
let stage, layer;

window.State = State;
State.init(formats[imgType])
initCanvas();

function initCanvas () {
  stage = new Konva.Stage({
    container: 'image-container',
    width: State.get('width'),
    height: State.get('height'),
  });

  layer = new Konva.Layer();
  stage.add(layer);

  document.getElementById('day-size').value = State.get('day.size');
  document.getElementById('address-size').value = State.get('address.size');

  const imageObj = new Image();
  imageObj.src = `imgs/EJ-${imgType}.jpg`;

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
  const dayText = new Konva.Text({
    text: State.get('day.text') || 'Altere o dia e horário no campo abaixo',
    x: State.get('day.x') || State.get('width') / 2,
    y: (State.get('height') / 2) - 25,
    draggable: true,
    fontFamily: 'sans-serif',
    fontSize: State.get('day.size'),
    fontStyle: State.get('day.style'),
    fill: State.get('day.color'),
    align: State.get('day.align') || 'center',
    shadowColor: State.get('day.shadowColor') || '#000',
    shadowBlur: State.get('day.shadowBlur') || 0,
    shadowOffsetX: State.get('day.shadowOffsetX') || 5,
    shadowOffsetY: State.get('day.shadowOffsetY') || 5,
    shadowOpacity: State.get('day.shadowOpacity') || 1,
    shadowEnabled: State.get('day.shadowEnabled') || false,
  });

  State.set('day.x', dayText.x());
  State.set('day.y', dayText.y());
  State.set('day.align', dayText.align());
  if (State.get('day.offsetX') === undefined) State.set('day.offsetX', dayText.width() / 2);
  State.set('day.shadowColor', dayText.shadowColor());
  State.set('day.shadowBlur', dayText.shadowBlur());
  State.set('day.shadowOffsetX', dayText.shadowOffsetX());
  State.set('day.shadowOffsetY', dayText.shadowOffsetY());
  State.set('day.shadowOpacity', dayText.shadowOpacity());
  State.set('day.shadowEnabled', dayText.shadowEnabled());

  const addressText = new Konva.Text({
    text: State.get('address.text') || 'Altere o endereço no campo abaixo',
    x: State.get('address.x') || State.get('width') / 2,
    y: (State.get('height') / 2) + 25,
    fontSize: State.get('address.size'),
    draggable: true,
    fontFamily: 'sans-serif',
    fontStyle: State.get('address.style'),
    fill: State.get('address.color'),
    align: State.get('address.align') || 'center',
    shadowColor: State.get('address.shadowColor') || '#000',
    shadowBlur: State.get('address.shadowBlur') || 0,
    shadowOffsetX: State.get('address.shadowOffsetX') || 5,
    shadowOffsetY: State.get('address.shadowOffsetY') || 5,
    shadowOpacity: State.get('address.shadowOpacity') || 1,
    shadowEnabled: State.get('address.shadowEnabled') || false,
  });

  State.set('address.x', addressText.x());
  State.set('address.y', addressText.y());
  State.set('address.align', addressText.align());
  if (State.get('address.offsetX') === undefined) State.set('address.offsetX', addressText.width() / 2);
  State.set('address.shadowColor', addressText.shadowColor());
  State.set('address.shadowBlur', addressText.shadowBlur());
  State.set('address.shadowOffsetX', addressText.shadowOffsetX());
  State.set('address.shadowOffsetY', addressText.shadowOffsetY());
  State.set('address.shadowOpacity', addressText.shadowOpacity());
  State.set('address.shadowEnabled', addressText.shadowEnabled());

  if (State.get('address.x') === undefined)
    State.set('address.x', State.get('width') / 2);

  const font = new FontFaceObserver(State.get('fontFamily'));
  font.load().then(function () {
    dayText.fontFamily(State.get('fontFamily'));
    addressText.fontFamily(State.get('fontFamily'));

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
    dayText.x(State.get('day.x'));
    addressText.x(State.get('address.x'));

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
    // important pos - is absolute position of the node
    // you should return absolute position too
    const maxY = stage.height() - node.getClientRect().height;
    return {
      x: this.absolutePosition().x,
      y: (pos.y < 0 ? 0 : pos.y > maxY ? maxY : pos.y)
    };
  });
}

function fitStageIntoParentContainer() {
  const container = document.getElementById('container');

  // now we need to fit stage into parent
  const containerWidth = container.offsetWidth;
  const containerHeight = window.visualViewport.height * 0.5;
  // to do this we need to scale the stage
  const scale = (State.get('height') >= State.get('width')) ?
                (containerHeight / State.get('height')) : (containerWidth / State.get('width'));

  stage.width(State.get('width') * scale);
  stage.height(State.get('height') * scale);
  stage.scale({ x: scale, y: scale });
  stage.draw();
}

// adapt the stage on any window resize
window.addEventListener('resize', fitStageIntoParentContainer);

// GENERAL BUTTONS EVENTS
document.getElementById('format').addEventListener('change', function (e) {
  imgType = e.target.value;
  State.set('width', formats[imgType].width);
  State.set('height', formats[imgType].height);
  State.set('fontFamily', formats[imgType].fontFamily);
  State.set('day.size', formats[imgType].day.size);
  State.set('address.size', formats[imgType].address.size);

  if (State.get('day.align') === 'center') {
    State.set('day.x', State.get('width') / 2);
  } else if (State.get('day.align') === 'right') {
    State.set('day.x', State.get('width') - 10);
  }

  if (State.get('address.align') === 'center') {
    State.set('address.x', State.get('width') / 2);
  } else if (State.get('address.align') === 'right') {
    State.set('address.x', State.get('width') - 10);
  }

  removeTextEvents(['day', 'address']);
  stage.destroy();
  document.getElementById('image-container').classList.add('loader');
  initCanvas();

  if (imgType === 'panfleto') {
    document.getElementById('save-pdf').classList.remove('hide');
  } else {
    document.getElementById('save-pdf').classList.add('hide');
  }
});

document.getElementById('buttons').addEventListener('click', function (e) {
  const pixelRatio = State.get('width') / stage.width();
  const dataURL = stage.toDataURL({
    mimeType: 'image/jpeg',
    quality: 1,
    pixelRatio
  });

  if (e.target.id === 'save') {
    downloadImg(dataURL, `Arte Encontro Jovem ${imgType}.jpg`);
  } else if (e.target.id === 'save-pdf') {
    downloadPDF(dataURL);
  }
    
}, false);

const coll = document.getElementsByClassName('collapse-toggle');
for (let i = 0; i < coll.length; i++) {
  coll[i].addEventListener('click', function() {
    this.classList.toggle('active');
    const content = this.nextElementSibling;
    if (content.style.display === 'flex') {
      content.style.display = 'none';
    } else {
      content.style.display = 'flex';
    }
  });
}

function downloadImg (uri, name) {
  var link = document.createElement('a');
  link.download = name;
  link.href = uri;
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  link = null;
}

function downloadPDF (uri) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.addImage(uri, 'JPEG', 3, 3, 99, 142);
  doc.addImage(uri, 'JPEG', 108, 3, 99, 142);
  doc.addImage(uri, 'JPEG', 3, 151, 99, 142);
  doc.addImage(uri, 'JPEG', 108, 151, 99, 142);
  doc.line(105,3, 105, 293);
  doc.line(3,148, 207, 148);
  doc.save('Folheto Encontro Jovem.pdf');
}
