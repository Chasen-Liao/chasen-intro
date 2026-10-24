const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const html = fs.readFileSync(path.resolve(__dirname, '..', 'index.html'), 'utf8');

const root = path.resolve(__dirname, '..');

test('renders the intro overlay before the page content', () => {
  const intro = html.indexOf('id="intro"');
  assert.ok(intro > -1, 'missing intro overlay');
  assert.ok(intro < html.indexOf('<main>'), 'intro must paint before the page');
  assert.match(html, /<video class="intro__video" id="intro-video"[^>]*muted[^>]*playsinline/);
});

test('serves separate landscape and portrait renders', () => {
  for (const file of ['intro-wide.mp4', 'intro-portrait.mp4']) {
    const full = path.join(root, 'assets', 'intro', file);
    assert.ok(fs.statSync(full).size > 50 * 1024, `${file} looks empty`);
    assert.match(html, new RegExp(`assets/intro/${file}`));
  }
});

test('played video covers the viewport without letterboxing', () => {
  assert.match(html, /\.intro__video\{[^}]*object-fit:cover/);
  assert.match(html, /\.intro\{[^}]*background:var\(--paper\)/);
});

test('skips the intro once seen, on reduced motion, or without JS', () => {
  assert.match(html, /sessionStorage\.getItem\('chasen:intro-seen'\)/);
  assert.match(html, /prefers-reduced-motion:reduce/);
  assert.match(html, /@media \(prefers-reduced-motion:reduce\)\{\s*\.intro\{display:none;\}/);
  assert.match(html, /<noscript><style>[^<]*\.intro\{display:none !important;\}/);
});

test('finishes on end, click, escape, error, or timeout', () => {
  assert.match(html, /video\.addEventListener\('ended', finish\)/);
  assert.match(html, /video\.addEventListener\('error', finish\)/);
  assert.match(html, /intro\.addEventListener\('click', finish\)/);
  assert.match(html, /e\.key === 'Escape'/);
  assert.match(html, /setTimeout\(finish, 9000\)/);
});
