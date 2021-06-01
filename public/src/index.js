import { removeTextEvents } from './modules/Events.js'
import formats from './formats-config.js'
import State from './modules/State.js'
import { downloadImg, downloadPDF } from './modules/Downloader.js';
import Canvas from './modules/Canvas.js';
import { fitStageIntoParentContainer } from './utils.js';

let imgType = document.getElementById('format').value;

window.State = State;
State.init(formats[imgType]);
Canvas.init(imgType);

// adapt the stage on any window resize
window.addEventListener('resize', fitStageIntoParentContainer);

// GENERAL BUTTONS EVENTS
document.getElementById('format').addEventListener('change', function (e) {
  const stage = State.get('stage');
  imgType = e.target.value;
  State.merge(formats[imgType]);
  
  // if (State.get('day.align') === 'center') {
  //   State.set('day.x', State.get('width') / 2);
  // } else if (State.get('day.align') === 'right') {
  //   State.set('day.x', State.get('width') - 10);
  // }

  // if (State.get('address.align') === 'center') {
  //   State.set('address.x', State.get('width') / 2);
  // } else if (State.get('address.align') === 'right') {
  //   State.set('address.x', State.get('width') - 10);
  // }

  removeTextEvents(['day', 'address']);
  stage.destroy();
  document.getElementById('image-container').classList.add('loader');
  Canvas.init(imgType);

  if (imgType === 'panfleto') {
    document.getElementById('save-pdf').classList.remove('hide');
  } else {
    document.getElementById('save-pdf').classList.add('hide');
  }
});

document.getElementById('buttons').addEventListener('click', function (e) {
  const stage = State.get('stage');
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
