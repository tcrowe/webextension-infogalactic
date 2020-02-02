const { get, set, load, onChange } = require("./storage");
const toggleOn = document.getElementById("toggle-on");
const toggleOff = document.getElementById("toggle-off");

/**
 * Handling the event when a user changes settings styate
 * @method state_change
 */
function state_change() {
  const enabled = get("enabled");
  toggleOn.checked = enabled === true;
  toggleOff.checked = enabled === false;
}

toggleOn.addEventListener("click", () => set("enabled", true));
toggleOff.addEventListener("click", () => set("enabled", false));
onChange(state_change);
load(state_change);
