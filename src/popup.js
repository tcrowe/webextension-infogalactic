const { get, set, load, onChange } = require("./storage");
const toggleOn = document.getElementById("toggle-on");
const toggleOff = document.getElementById("toggle-off");

function update() {
  const enabled = get("enabled");
  toggleOn.checked = enabled === true;
  toggleOff.checked = enabled === false;
}

toggleOn.addEventListener("click", () => set("enabled", true));
toggleOff.addEventListener("click", () => set("enabled", false));
onChange(update);
load(update);
