import { JSDOM, CookieJar } from 'jsdom';

const cookieJar = new CookieJar();

export default function reset (): void {
  const dom = new JSDOM(`
    <!doctype html>
    <html lang="en">
      <head>
        <title>Tests</title>
      </head>
      <body>
      </body>
    </html>
  `, {
    url: 'http://localhost/',
    cookieJar
  });

  global.window = dom.window;
  global.document = dom.window.document;
}

reset();
