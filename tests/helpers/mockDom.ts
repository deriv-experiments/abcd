import { JSDOM } from "jsdom";

export default function reset() {
  const dom = new JSDOM(`
    <!doctype html>
    <html lang="en">
      <head>
        <title>Tests</title>
      </head>
      <body>
      </body>
    </html>
  `);

  global.window = dom.window;
  global.document = dom.window.document;
}

reset();
