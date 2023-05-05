import test from 'basictap';
import resetDom from './helpers/mockDom.ts';

import abcd from '../src/index.ts';

test('it adds only one stylesheet when init is called twice', (t) => {
  resetDom();

  document.body.innerHTML = `
    <div ab-test-name="greeting" ab-test-variant="control">
      Hello World
    </div>
  `;

  abcd([{
    name: 'greeting',
    variants: { control: 0 }
  }]);
  abcd([{
    name: 'greeting',
    variants: { control: 0 }
  }]);

  const styleSheets = document.querySelectorAll('#abTestStyles');
  t.equal(styleSheets.length, 1, 'Only one abTestStyles stylesheet is added');
});

test('it shows controls with no tests', (t) => {
  resetDom();

  document.body.innerHTML = `
    <div ab-test-name="greeting" ab-test-variant="control">
      Hello World
    </div>
  `;

  abcd([]);

  t.equal(document.body.textContent?.trim(), 'Hello World');
});

test('it hides variants with no tests', (t) => {
  resetDom();

  document.body.innerHTML = `
    <div ab-test-name="greeting" ab-test-variant="test">
      Hello World
    </div>
  `;

  abcd([]);

  const div = document.body.querySelector('div');

  t.equal(window.getComputedStyle(div).display, 'none');
});

test('it shows the chosen variant', (t) => {
  resetDom();

  document.cookie = 'ab-greeting=test; path=/';

  document.body.innerHTML = `
    <div ab-test-name="greeting" ab-test-variant="test">
      Hello World
    </div>
  `;

  abcd([{
    name: 'greeting',
    variants: { test: 1 }
  }]);

  t.equal(document.body.textContent?.trim(), 'Hello World');
});

test('it hides the non-chosen variant', (t) => {
  resetDom();

  document.cookie = 'ab-greeting=test; path=/';

  document.body.innerHTML = `
    <div ab-test-name="greeting" ab-test-variant="control">
      Hello World
    </div>
  `;

  abcd([{
    name: 'greeting',
    variants: {
      control: 0,
      test: 1
    }
  }]);

  const div = document.body.querySelector('div');
  t.equal(window.getComputedStyle(div).display, 'none');
});

test('it handles multiple tests correctly', (t) => {
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
    {
      name: 'greeting',
      variants: {
        control: 0,
        test: 1
      }
    },
    {
      name: 'color',
      variants: {
        control: 0,
        blue: 1
      }
    }
  ]);

  t.equal(document.body.textContent.trim(), 'Hello Test\n    \n    \n      Blue');
});

test('it sets display to none for non-chosen variants', (t) => {
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

  abcd([{
    name: 'greeting',
    variants: {
      control: 0.5,
      test: 0.5
    }
  }]);

  const controlElement = document.querySelector('[ab-test-variant="control"]');
  const testElement = document.querySelector('[ab-test-variant="test"]');

  if (window.getComputedStyle(testElement).display === 'inherit') {
    t.equal(window.getComputedStyle(controlElement).display, 'none', 'Control element has display set to none');
  } else if (window.getComputedStyle(controlElement).display === 'inherit') {
    t.equal(window.getComputedStyle(testElement).display, 'none', 'Test element has display set to none');
  } else {
    t.fail('Neither control nor test element has display set to inherit');
  }
});
