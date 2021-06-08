import cloneDeep from '../../lib/lodash.clonedeep.min.js';

let state = {};

function init (data) {
  state = cloneDeep(data);
  state.texts = [];
};

function get (key) {
  if (key) {
    const keys = key.split('.');
    let curr = state, i;
    for (i = 0; i < keys.length - 1; i++) {
      curr = curr[keys[i]];
    }
    return curr[keys[i]];
  }
  else return state;
}

function set (key, value) {
  const keys = key.split('.');
  let curr = state, i;
  for (i = 0; i < keys.length - 1; i++) {
    curr = curr[keys[i]];
  }
  curr[keys[i]] = value;
}

function merge (newData) {
  state = {
    ...state,
    ...newData
  };
}

export default {
  init,
  get,
  set,
  merge
};

