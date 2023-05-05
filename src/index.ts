export type TestConfig = {
  name: string;
  variants: { [key: string]: number };
};

export default function init(config: TestConfig[]): void {
  const style = document.createElement("style");
  style.textContent = `[ab-test-variant]:not([ab-test-variant="control"]) { display: none; }`;
  document.head.appendChild(style);

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
      document.cookie = `${cookieName}=${chosenVariant}; path=/; max-age=2592000`; // Expires in 30 days
    }
  }

  function applyAbTests(): void {
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

  function getCookieValue(name: string): string | undefined {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);

    if (parts.length === 2) {
      return parts.pop().split(";").shift();
    }
  }
}

if (document?.currentScript?.getAttribute("config")) {
  const configPath = document.currentScript.getAttribute("config");

  fetch(configPath)
    .then((response) => response.json())
    .then(init)
    .catch((error) => console.error("Error loading A/B test configuration:", error));
}
