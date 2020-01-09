const { get } = require("./storage");
const wpEnglishPattern = new RegExp("^https?://en.wikipedia.org/wiki/");
const igEnglish = "https://infogalactic.com/info/";
const filter = { urls: ["<all_urls>"] };
const extraInfo = ["blocking"];

function before_request(req) {
  const enabled = get("enabled");

  if (enabled === false) {
    // the extension is disabled
    return;
  }

  let { url } = req;

  if (wpEnglishPattern.test(url) === true) {
    const redirectUrl = url.replace(wpEnglishPattern, igEnglish);
    return { redirectUrl };
  }
}

chrome.webRequest.onBeforeRequest.addListener(
  before_request,
  filter,
  extraInfo
);
