# abcd - Simple and Lightweight A/B Testing Library

This is a minimalistic and easy-to-use A/B testing library that enables you to effortlessly set up and manage A/B tests on your website. It is designed to be straightforward, requiring minimal configuration, and ensuring a quick and efficient way to test different variations of your site.

## Demo
- Check out the [interactive demo](https://deriv-experiments.github.io/abcd/)
- Or watch the video:

<video src="https://user-images.githubusercontent.com/129744061/236439561-dc28b1fe-2a2b-42c1-9c9f-e95712955a4e.mov" controls="controls" style="max-width: 730px;">
</video>

## Features

- Simple integration with HTML
- No dependencies
- Lightweight
- Cookie-based persistence of chosen variants

## Installation

### Option 1: Script Tag

You can include the abcd library in your project by adding the following script tag to your HTML file:

```html
<script src="https://deriv-experiments.github.io/abcd/abcd.min.js" config="abTestsConfig.json"></script>
```

Ensure that you replace `"abTestsConfig.json"` with the correct path to your configuration file.

### Option 2: npm Package

You can also install the abcd library as an npm package:

```bash
npm install @deriv-experiments/abcd
```

Then, import the library in your JavaScript or TypeScript code:

```javascript
import abcd from '@deriv-experiments/abcd';

abcd([
  {
    "name": "header",
    "variants": {
      "control": 0.8,
      "visible": 0.2
    }
  },
  {
    "name": "greeting",
    "variants": {
      "control": 0.5,
      "everyone": 0.25,
      "testers": 0.25
    }
  }
]);
```

## Usage

### 1. Set up the A/B test configuration

Create a JSON configuration file for your A/B tests. This file will contain an array of test objects, where each test object has a `name` and a `variants` property. The `variants` property is an object that maps the variant names to their corresponding probabilities.

Example `abTestsConfig.json`:

```json
[
  {
    "name": "header",
    "variants": {
      "control": 0.8,
      "visible": 0.2
    }
  },
  {
    "name": "greeting",
    "variants": {
      "control": 0.5,
      "everyone": 0.25,
      "testers": 0.25
    }
  }
]
```

### 2. Add A/B test elements to your HTML

Include the elements that you want to test in your HTML, and add the `ab-test-name` and `ab-test-variant` attributes to them. The `ab-test-name` attribute should match the test names defined in your configuration file, while the `ab-test-variant` attribute should correspond to the variant names.

Example HTML:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hello World</title>
  <script src="https://deriv-experiments.github.io/abcd/abcd.min.js" config="abTestsConfig.json"></script>
</head>
<body>
  <div ab-test-name="header" ab-test-variant="visible">
    <h1>Greater</h1>
  </div>

  <div ab-test-name="greeting" ab-test-variant="control">
    Hello World
  </div>

  <div ab-test-name="greeting" ab-test-variant="everyone">
    Hello Everyone
  </div>

  <div ab-test-name="greeting" ab-test-variant="testers">
    Hello Testers
  </div>
</body>
</html>
```

### 3. Launch your tests

Once you have set up the configuration file and added the A/B test elements to your HTML, the library will automatically choose a variant for each test based on the probabilities defined in the configuration file. The chosen variants will persist
