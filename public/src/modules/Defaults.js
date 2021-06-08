import State from "./State.js";

export default function () {
  return {
    text: 'Insira o texto no campo abaixo',
    fontSize: State.get('size'),
    x: State.get('width') / 2,
    y: State.get('height') / 2,
    draggable: true,
    fontFamily: State.get('font'),
    fontStyle: 'normal',
    fill: State.get('colors')[0],
    align: 'center',
    shadowColor: '#000000',
    shadowBlur: 0,
    shadowOffsetX: 5,
    shadowOffsetY: 5,
    shadowOpacity: 1,
    shadowEnabled: false,
  }
}