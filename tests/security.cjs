const { chromium } = require('playwright');
const fs = require('fs'), http = require('http'), assert = require('assert');
const server = http.createServer((req, res) => {
  const path = new URL(req.url, 'http://localhost').pathname;
  try { const file = '.' + (path === '/' ? '/index.html' : path); res.setHeader('Content-Type', file.endsWith('.html') ? 'text/html' : 'application/octet-stream'); res.end(fs.readFileSync(file)); }
  catch { res.statusCode = 404; res.end(); }
});
(async () => {
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage(), errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto('http://127.0.0.1:' + server.address().port);
    await page.waitForTimeout(500);
    assert.equal(await page.title(), 'Calculadora');
    await page.keyboard.type('2+3');
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('#numDisp').innerText(), '5');
    assert((await page.locator('body').innerText()).length > 100);
    assert.deepEqual(errors, []);
    console.log('PASS: calculator opens without JavaScript errors');
  } finally { await browser.close(); server.close(); }
})().catch(e => { console.error(e); server.close(); process.exitCode = 1; });
