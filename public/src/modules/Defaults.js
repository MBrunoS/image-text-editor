import State from "./State.js";

let _unsets;

function isSet (key) {
  const keys = key.split('.');
  if (State.get(key) === undefined) {
    _unsets[keys[0]].push(keys[1]);
    return false;
  } else {
    return true;
  }
}
export function unsets () { return _unsets; }

export default function () {
  _unsets = {
    day: [],
    address: []
  };

  return {
    day: {
      text: isSet('day.text') ? State.get('day.text') : 'Altere o dia e horário no campo abaixo',
      fontSize: State.get('day.size'),
      x: isSet('day.x') ? State.get('day.x') : State.get('width') / 2,
      y: (State.get('height') / 2) - 25,
      draggable: true,
      fontFamily: 'sans-serif',
      fontStyle: isSet('day.fontStyle') ? State.get('day.fontStyle') : 'normal',
      fill: State.get('day.colors')[0],
      align: isSet('day.align') ? State.get('day.align') : 'center',
      shadowColor: isSet('day.shadowColor') ? State.get('day.shadowColor') : '#000000',
      shadowBlur: isSet('day.shadowBlur') ? State.get('day.shadowBlur') : 0,
      shadowOffsetX: isSet('day.shadowOffsetX') ? State.get('day.shadowOffsetX') : 5,
      shadowOffsetY: isSet('day.shadowOffsetY') ? State.get('day.shadowOffsetY') : 5,
      shadowOpacity: isSet('day.shadowOpacity') ? State.get('day.shadowOpacity') : 1,
      shadowEnabled: isSet('day.shadowEnabled') ? State.get('day.shadowEnabled') : false,
    },
    address: {
      text: isSet('address.text') ? State.get('address.text') : 'Altere o endereço no campo abaixo',
      fontSize: State.get('address.size'),
      x: isSet('address.x') ? State.get('address.x') : State.get('width') / 2,
      y: (State.get('height') / 2) + 25,
      draggable: true,
      fontFamily: 'sans-serif',
      fontStyle: isSet('address.fontStyle') ? State.get('address.fontStyle') : 'normal',
      fill: State.get('address.colors')[0],
      align: isSet('address.align') ? State.get('address.align') : 'center',
      shadowColor: isSet('address.shadowColor') ? State.get('address.shadowColor') : '#000000',
      shadowBlur: isSet('address.shadowBlur') ? State.get('address.shadowBlur') : 0,
      shadowOffsetX: isSet('address.shadowOffsetX') ? State.get('address.shadowOffsetX') : 5,
      shadowOffsetY: isSet('address.shadowOffsetY') ? State.get('address.shadowOffsetY') : 5,
      shadowOpacity: isSet('address.shadowOpacity') ? State.get('address.shadowOpacity') : 1,
      shadowEnabled: isSet('address.shadowEnabled') ? State.get('address.shadowEnabled') : false,
    }
  }
}