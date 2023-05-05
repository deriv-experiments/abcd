import getCookieValue from './getCookieValue.ts';

export interface TestConfig {
  name: string
  variants: Record<string, number>
}

// Tests expire in 30 days
const TEST_EXPIRE_TIME = (60 * 60 * 24) * 30;

function ensureStyleAppended (): void {
  if (document.getElementById('abTestStyles') != null) {
    return;
  }

  const style = globalThis.document.createElement('style');
  style.id = 'abTestStyles';
  globalThis.document.head.appendChild(style);

  insertCssRule('[ab-test-variant]:not([ab-test-variant="control"]) { display: none; }');
}

function insertCssRule (rule: string): void {
  const stylesheet = document.getElementById('abTestStyles') as HTMLStyleElement;
  const sheet = stylesheet.sheet as CSSStyleSheet;
  sheet.insertRule(rule, sheet.cssRules.length);
}

export default function init (config: TestConfig[]): void {
  ensureStyleAppended();

  for (const test of config) {
    setupTest(test);
  }

  function setupTest (test: TestConfig): void {
    const cookieName = `ab-${test.name}`;
    let chosenVariant = getCookieValue(cookieName);

    if (!chosenVariant) {
      const rand = Math.random();
      let cumulativeProbability = 0;
      chosenVariant = 'control';
      for (const variant in test.variants) {
        cumulativeProbability += test.variants[variant];
        if (rand <= cumulativeProbability) {
          chosenVariant = variant;
          break;
        }
      }

      globalThis.document.cookie = `${cookieName}=${chosenVariant}; path=/; max-age=${TEST_EXPIRE_TIME}`;
    }

    for (const variant in test.variants) {
      const rule = `[ab-test-name="${test.name}"][ab-test-variant="${variant}"] { display: ${variant === chosenVariant ? 'inherit' : 'none'}; }`;
      insertCssRule(rule);
    }
  }
}

const configPath = globalThis.document?.currentScript?.getAttribute('config');

if (configPath) {
  ensureStyleAppended();

  fetch(configPath)
    .then(async (response) => await response.json())
    .then(init)
    .catch((error) => { console.error('Error loading A/B test configuration:', error); });
}
