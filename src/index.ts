import getCookieValue from './getCookieValue.ts';

export type TestConfig = {
  name: string;
  variants: { [key: string]: number };
};

function ensureStyleAppended() {
  if (document.getElementById("abTestStyles")) {
    return;
  }

  const style = globalThis.document.createElement("style");
  style.id = "abTestStyles";
  globalThis.document.head.appendChild(style);

  insertCssRule('[ab-test-variant]:not([ab-test-variant="control"]) { display: none; }');
}

function insertCssRule(rule: string) {
  const stylesheet = document.getElementById("abTestStyles") as HTMLStyleElement;
  const sheet = stylesheet.sheet as CSSStyleSheet;
  sheet.insertRule(rule, sheet.cssRules.length);
}

export default function init(config: TestConfig[]): void {
  ensureStyleAppended();

  for (const test of config) {
    setupTest(test);
  }

  function setupTest(test: TestConfig): void {
    const cookieName = `ab-${test.name}`;
    let chosenVariant = getCookieValue(cookieName);

    if (!chosenVariant) {
      // Calculate the random number to choose a variant
      const rand = Math.random();
      let sum = 0;

      // Iterate through the test's variants to find the chosen one
      for (const variant in test.variants) {
        sum += test.variants[variant];
        if (rand <= sum) {
          chosenVariant = variant;
          break;
        }
      }

      // Set a cookie for the chosen variant
      globalThis.document.cookie = `${cookieName}=${chosenVariant}; path=/; max-age=2592000`; // Expires in 30 days
    }

    // Insert CSS rules for the test
    for (const variant in test.variants) {
      const rule = `[ab-test-name="${test.name}"][ab-test-variant="${variant}"] { display: ${variant === chosenVariant ? "inherit" : "none"}; }`;
      insertCssRule(rule);
    }
  }
}

const configPath = globalThis.document?.currentScript?.getAttribute("config");
if (configPath) {
  ensureStyleAppended();

  fetch(configPath)
    .then((response) => response.json())
    .then(init)
    .catch((error) => console.error("Error loading A/B test configuration:", error));
}
