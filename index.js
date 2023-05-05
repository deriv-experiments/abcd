// src/index.ts
function init(config) {
  const style = globalThis.document.createElement("style");
  style.textContent = `[ab-test-variant]:not([ab-test-variant="control"]) { display: none; }`;
  globalThis.document.head.appendChild(style);
  for (const test of config) {
    setupTest(test);
  }
  applyAbTests();
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
  }
  function applyAbTests() {
    const testElements = document.querySelectorAll("[ab-test-name]");
    for (const element of testElements) {
      const testName = element.getAttribute("ab-test-name");
      const testVariant = element.getAttribute("ab-test-variant");
      const chosenVariant = getCookieValue(`ab-${testName}`);
      if (testVariant === chosenVariant) {
        element.style.display = "inherit";
      } else {
        element.style.display = "none";
      }
    }
  }
  function getCookieValue(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop().split(";").shift();
    }
  }
}
if (globalThis.document?.currentScript?.getAttribute("config")) {
  const configPath = globalThis.document.currentScript.getAttribute("config");
  fetch(configPath).then((response) => response.json()).then(init).catch((error) => console.error("Error loading A/B test configuration:", error));
}
export {
  init as default
};
//# sourceMappingURL=index.js.map
