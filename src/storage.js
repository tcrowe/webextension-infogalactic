const lget = require("lodash/get");
const lset = require("lodash/set");
const noop = require("lodash/noop");
let state = { enabled: true };
const keys = Object.keys(state);

/**
 * Merge in some state
 * @method merge
 * @param {object} opts
 * @returns {object}
 */
const merge = opts => (state = Object.assign(state, opts));

/**
 * Load local storage
 * @method load
 * @param {Function} done
 */
const load = (done = noop) => chrome.storage.local.get(keys, res => done(res));
/**
 * Save to local storage
 * @method save
 * @param {object} opts
 * @param {Function} done
 */
const save = () => chrome.storage.local.set(state, noop);

/**
 * Get a state value
 * @method get
 * @param {string} path
 * @returns {object}
 */
const get = path => lget(state, path);

/**
 * Set a state value
 * @method
 * @param {string} path
 * @param {object} val
 */
const set = (path, val) => lset(state, path, val) && save();

/**
 * Get notified when storage changes
 * @method onChange
 * @param {Function} fn
 */
const onChange = fn => chrome.storage.onChanged.addListener(fn);

function storage_change(res) {
  if (res !== undefined && res !== null && Object.keys(res).length > 0) {
    merge(res);
  }
}

load(storage_change);
onChange(() => load(storage_change));

module.exports = {
  state,
  get,
  set,
  load,
  save,
  onChange
};
