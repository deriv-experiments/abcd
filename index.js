// src/getCookieValue.ts
function getCookieValue(name) {
  if (!name || typeof name !== "string") {
    throw new Error("Invalid cookie name provided");
  }
  const namePattern = /^[^;=\s]+$/;
  if (!namePattern.test(name)) {
    throw new Error("Invalid characters in cookie name");
  }
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const decodedValue = decodeURIComponent(parts.pop()?.split(";").shift() || "");
    if (decodedValue) {
      return decodedValue;
    } else {
      throw new Error("Error decoding cookie value");
    }
  }
}

// src/index.ts
function ensureStyleAppended() {
  if (document.getElementById("abTestStyles")) {
    return;
  }
  const style = globalThis.document.createElement("style");
  style.id = "abTestStyles";
  globalThis.document.head.appendChild(style);
  insertCssRule('[ab-test-variant]:not([ab-test-variant="control"]) { display: none; }');
}
function insertCssRule(rule) {
  const stylesheet = document.getElementById("abTestStyles");
  const sheet = stylesheet.sheet;
  sheet.insertRule(rule, sheet.cssRules.length);
}
function init(config) {
  ensureStyleAppended();
  for (const test of config) {
    setupTest(test);
  }
  function setupTest(test) {
    const cookieName = `ab-${test.name}`;
    let chosenVariant = getCookieValue(cookieName);
    if (!chosenVariant) {
      const rand = Math.random();
      let sum = 0;
      for (const variant in test.variants) {
        sum += test.variants[variant];
        if (rand <= sum) {
          chosenVariant = variant;
          break;
        }
      }
      globalThis.document.cookie = `${cookieName}=${chosenVariant}; path=/; max-age=2592000`;
    }
    for (const variant in test.variants) {
      const rule = `[ab-test-name="${test.name}"][ab-test-variant="${variant}"] { display: ${variant === chosenVariant ? "inherit" : "none"}; }`;
      insertCssRule(rule);
    }
  }
}
var configPath = globalThis.document?.currentScript?.getAttribute("config");
if (configPath) {
  ensureStyleAppended();
  fetch(configPath).then((response) => response.json()).then(init).catch((error) => console.error("Error loading A/B test configuration:", error));
}
export {
  init as default
};
//# sourceMappingURL=index.js.map
