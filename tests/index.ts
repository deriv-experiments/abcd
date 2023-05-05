import test from 'basictap';
import resetDom from './helpers/mockDom.ts';

import abcd from '../src/index.ts';

test('it shows controls with no tests', t => {
  resetDom();

  document.body.innerHTML = `
    <div ab-test-name="greeting" ab-test-variant="control">
      Hello World
    </div>
  `;

  abcd([]);

  t.equal(document.body.innerText.trim(), 'Hello World');
});

test('it hides variants with no tests', async t => {
  resetDom();

  document.body.innerHTML = `
    <div ab-test-name="greeting" ab-test-variant="test">
      Hello World
    </div>
  `;

  abcd([]);

  const div = document.body.querySelector('div')

  t.equal(div?.style.display, 'none');
});

test('it shows the chosen variant', t => {
  resetDom();

  document.cookie = 'ab-greeting=test; path=/';

  document.body.innerHTML = `
    <div ab-test-name="greeting" ab-test-variant="test">
      Hello World
    </div>
  `;

  abcd([{ name: 'greeting', variants: { test: 1 } }]);

  t.equal(document.body.innerText.trim(), 'Hello World');
});

test('it hides the non-chosen variant', t => {
  resetDom();

  document.cookie = 'ab-greeting=test; path=/';

  document.body.innerHTML = `
    <div ab-test-name="greeting" ab-test-variant="control">
      Hello World
    </div>
  `;

  abcd([{ name: 'greeting', variants: { test: 1 } }]);

  const div = document.body.querySelector('div');
  t.equal(div?.style.display, 'none');
});

test('it handles multiple tests correctly', t => {
  resetDom();

  document.cookie = 'ab-greeting=test; path=/';
  document.cookie = 'ab-color=blue; path=/';

  document.body.innerHTML = `
    <div ab-test-name="greeting" ab-test-variant="test">
      Hello Test
    </div>
    <div ab-test-name="color" ab-test-variant="blue">
      Blue
    </div>
  `;

  abcd([
    { name: 'greeting', variants: { test: 1 } },
    { name: 'color', variants: { blue: 1 } },
  ]);

  t.equal(document.body.innerText.trim(), 'Hello Test  \n Blue');
});

test('it sets display to none for non-chosen variants', t => {
  resetDom();

  document.cookie = 'ab-greeting=test; path=/';

  document.body.innerHTML = `
    <div ab-test-name="greeting" ab-test-variant="control">
      Hello Control
    </div>
    <div ab-test-name="greeting" ab-test-variant="test">
      Hello Test
    </div>
  `;

  abcd([{ name: 'greeting', variants: { control: 0.5, test: 0.5 } }]);

  const controlElement = document.querySelector('[ab-test-variant="control"]');
  const testElement = document.querySelector('[ab-test-variant="test"]');

  if (testElement?.style.display === 'inherit') {
    t.equal(controlElement?.style.display, 'none', 'Control element has display set to none');
  } else if (controlElement?.style.display === 'inherit') {
    t.equal(testElement?.style.display, 'none', 'Test element has display set to none');
  } else {
    t.fail('Neither control nor test element has display set to inherit');
  }
});
