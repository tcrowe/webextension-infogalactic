const { get } = require("./storage");
const wpEnglishPattern = new RegExp(
  "^https?://([a-z]{2}).(m.)?wikipedia.org/wiki/"
);
const infogalactic = "https://infogalactic.com/info/";
const filter = { urls: ["<all_urls>"] };
const extraInfo = ["blocking"];

/**
 * Handle the event before a request is sent
 * @method before_request
 * @param {object} req
 * @returns {object}
 */
function before_request(req) {
  const enabled = get("enabled");

  if (enabled === false) {
    // the extension is disabled
    return;
  }

  let { url } = req;

  if (wpEnglishPattern.test(url) === true) {
    const redirectUrl = url.replace(wpEnglishPattern, infogalactic);
    return { redirectUrl };
  }
}

chrome.webRequest.onBeforeRequest.addListener(
  before_request,
  filter,
  extraInfo
);
