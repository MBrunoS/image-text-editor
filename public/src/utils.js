import State from "./modules/State.js";

export function fitStageIntoParentContainer() {
  const stage = State.get('stage');
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