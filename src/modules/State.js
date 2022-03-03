let state = {};

const INITIAL_STATE = {
  width: 1080,
  height: 1080,
  size: 45,
  colors: ["#ffffff"],
};

function init() {
  state = { ...INITIAL_STATE };
  state.texts = [];
}

function get(key) {
  if (key) {
    const keys = key.split(".");
    let curr = state,
      i;
    for (i = 0; i < keys.length - 1; i++) {
      curr = curr[keys[i]];
    }
    return curr[keys[i]];
  } else return state;
}

function set(key, value) {
  const keys = key.split(".");
  let curr = state,
    i;
  for (i = 0; i < keys.length - 1; i++) {
    curr = curr[keys[i]];
  }
  curr[keys[i]] = value;
}

function merge(newData) {
  state = {
    ...state,
    ...newData,
  };
}

export default {
  init,
  get,
  set,
  merge,
};
