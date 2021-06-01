let state = {};

function init (data) {
  state = {...data};
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

export default {
  init,
  get,
  set,
};

