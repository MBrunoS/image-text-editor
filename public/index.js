import { addTextEvents, removeTextEvents } from './events.js'


const formats = {
  feed: {
    width: 1080, height: 1080,
    day: { color: '#000000', size: 35 },
    address: { color: '#000000', size: 30 }
  },
  story: {
    width: 1080, height: 1920,
    day: { color: '#000000', size: 35 },
    address: { color: '#000000', size: 30 }
  },
  wide: {
    width: 1920, height: 1080,
    day: { color: '#000000', size: 35 },
    address: { color: '#000000', size: 30 }
  },
  panfleto: {
    width: 2480, height: 3508,
    day: { color: '#f00000', size: 80 },
    address: { color: '#f00000', size: 80 }
  }
};

let imgType = document.getElementById('format').value;
const font = new FontFaceObserver('FonteEJ');
let { width, height, day, address } = formats[imgType];
let stage, layer;

initCanvas();

function initCanvas () {
  stage = new Konva.Stage({
    container: 'image-container',
    width: width,
    height: height,
  });

  layer = new Konva.Layer();
  stage.add(layer);

  document.getElementById('day-size').value = day.size;
  document.getElementById('address-size').value = address.size;

  const imageObj = new Image();
  imageObj.src = `EJ-${imgType}.jpg`;

  imageObj.onload = function () {
    document.getElementById('image-container').classList.remove('loader');
    const bg = new Konva.Image({
      x: 0,
      y: 0,
      image: imageObj,
      width: width,
      height: height,
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
  const dText = document.getElementById('day-input').value;
  const aText = document.getElementById('address-input').value;

  day.style = document.getElementById('day-style').className.includes('active') ? 'bold' : 'normal';
  address.style = document.getElementById('address-style').className.includes('active') ? 'bold' : 'normal';
  
  const dayText = new Konva.Text({
    text: (dText || 'Altere o dia e horário no campo abaixo'),
    x: width / 2,
    y: (height / 2) - 25,
    fontSize: day.size,
    align: 'center',
    draggable: true,
    fontFamily: 'sans-serif',
    fontStyle: day.style,
    fill: day.color,
    shadowColor: '#000',
    shadowBlur: 0,
    shadowOffsetX: 5,
    shadowOffsetY: 5,
    shadowOpacity: 1,
    shadowEnabled: false
  });

  const addressText = new Konva.Text({
    text: (aText || 'Altere o endereço no campo abaixo'),
    x: width / 2,
    y: (height / 2) + 25,
    fontSize: address.size,
    align: 'center',
    draggable: true,
    fontFamily: 'sans-serif',
    fontStyle: address.style,
    fill: address.color,
    shadowColor: '#000',
    shadowBlur: 0,
    shadowOffsetX: 5,
    shadowOffsetY: 5,
    shadowOpacity: 1,
    shadowEnabled: false
  });
  
  font.load().then(function () {
    dayText.fontFamily('FonteEJ');
    addressText.fontFamily('FonteEJ');
    dayText.offsetX(dayText.width() / 2);
    addressText.offsetX(addressText.width() / 2);
    layer.draw();
  });

  addTextEvents(['day', 'address'], [dayText, addressText], layer, width);
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
    const maxY = stage.height() - (node.height() / 2);
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
  const scale = (height >= width) ? (containerHeight / height) : (containerWidth / width);

  stage.width(width * scale);
  stage.height(height * scale);
  stage.scale({ x: scale, y: scale });
  stage.draw();
}

// adapt the stage on any window resize
window.addEventListener('resize', fitStageIntoParentContainer);

// GENERAL BUTTONS EVENTS
document.getElementById('format').addEventListener('change', function (e) {
  imgType = e.target.value;
  ({ width, height, day, address } = formats[imgType]);
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
  const pixelRatio = width / stage.width();
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
