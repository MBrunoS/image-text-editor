import State from './modules/State.js'
import formats from './formats-config.js'
import Canvas from './modules/Canvas.js';
import Events from './modules/Events.js'

const imgType = document.getElementById('format').value;

window.State = State;
State.init(formats[imgType]);
State.set('imgType', imgType);

if (State.get('font') === undefined) {
  State.set('font', 'Main-Font');
}

Canvas.init(imgType);
Events.init();

// Init predefined colors list
let colorsList = '';
State.get('colors').forEach(function (color){
  colorsList += `<option>${color}</option>`
});
document.getElementById('text-preset-colors').innerHTML = colorsList;

// GENERAL BUTTONS EVENTS
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
