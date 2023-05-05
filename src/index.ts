export type TestConfig = {
  name: string;
  variants: { [key: string]: number };
};

function ensureStyleAppended () {
  const style = globalThis.document.createElement("style");
  style.textContent = `[ab-test-variant]:not([ab-test-variant="control"]) { display: none; }`;
  globalThis.document.head.appendChild(style);
}

export default function init(config: TestConfig[]): void {
  ensureStyleAppended();

  for (const test of config) {
    setupTest(test);
  }

  applyAbTests();

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
  }

  function applyAbTests(): void {
    const testElements = document.querySelectorAll<HTMLElement>("[ab-test-name]");

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

  function getCookieValue(name: string): string | undefined {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);

    if (parts.length === 2) {
      return parts.pop()?.split(";").shift();
    }
  }
}

const configPath = globalThis.document?.currentScript?.getAttribute("config")
if (configPath) {
  ensureStyleAppended();

  fetch(configPath)
    .then((response) => response.json())
    .then(init)
    .catch((error) => console.error("Error loading A/B test configuration:", error));
}
