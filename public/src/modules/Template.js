function clone () {
  const element = document.querySelector('template').content.cloneNode(true).firstElementChild;
  element.querySelector('[data-handle=color]').value = State.get('colors')[0];
  element.querySelector('[data-handle=size]').value = State.get('size');

  return document.getElementById('texts-container').appendChild(element);
}

export default { clone }