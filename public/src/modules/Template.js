function clone () {
  const element = document.querySelector('template').content.cloneNode(true).firstElementChild;
  element.dataset.index = State.get('texts').length;
  element.firstElementChild.textContent += ` ${+element.dataset.index + 1}`;
  // console.log(element.firstElementChild);
  element.querySelector('.text-color').value = State.get('colors')[0];
  element.querySelector('.text-size').value = State.get('size');

  return document.getElementById('texts-container').appendChild(element);
}

export default { clone }