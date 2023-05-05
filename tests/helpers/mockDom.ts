import { parseHTML } from 'linkedom';

export default function reset () {
  const dom = parseHTML(`
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
  global.document = dom.document;

  global.window.location = {
    pathname: '/index.html'
  };
}

reset();
