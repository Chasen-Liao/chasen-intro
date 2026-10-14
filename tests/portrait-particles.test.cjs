// The portrait is now a 3D flashcard; this replaces the retired particle contract.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const html = fs.readFileSync(path.resolve(__dirname, '..', 'index.html'), 'utf8');

function readFunction(name) {
  const start = html.indexOf(`function ${name}(`);
  assert.notEqual(start, -1, `${name} should exist`);
  const bodyStart = html.indexOf('{', start);
  let depth = 0;
  for (let index = bodyStart; index < html.length; index += 1) {
    if (html[index] === '{') depth += 1;
    if (html[index] === '}') depth -= 1;
    if (depth === 0) return vm.runInNewContext(`(${html.slice(start, index + 1)})`);
  }
  assert.fail(`${name} should have a complete body`);
}

const getTarget = readFunction('getCardTarget');
const stepSpring = readFunction('stepCardSpring');
const rect = { left: 100, top: 50, width: 300, height: 400 };

function simulate(destination, hz) {
  let position = 0;
  let velocity = 0;
  for (let i = 0; i < hz; i += 1) {
    const next = stepSpring(position, velocity, destination, 1 / hz);
    position = next.position;
    velocity = next.velocity;
  }
  return { position, velocity };
}

test('keeps the real avatar and social preview source unchanged', () => {
  assert.match(html, /<img class="portrait__img" src="assets\/chasen-avatar-smile\.png"/);
  assert.match(html, /og:image" content="https:\/\/chasen-intro\.vercel\.app\/assets\/chasen-avatar-smile\.png"/);
});

test('replaces the portrait canvas with a non-interactive flashcard', () => {
  assert.match(html, /<div class="portrait__card" data-portrait-card>/);
  assert.doesNotMatch(html, /initPortraitParticles|portrait__particles/);
  const cardMarkup = html.slice(html.indexOf('<div class="portrait"'), html.indexOf('<!-- ═══════════ 02 ABOUT'));
  assert.doesNotMatch(cardMarkup, /tabindex|<button|role="button"/);
  assert.match(cardMarkup, /portrait__foil" aria-hidden="true"/);
  assert.match(cardMarkup, /portrait__glare" aria-hidden="true"/);
});

test('maps card center to a flat target', () => {
  const target = getTarget(rect, 250, 250);
  assert.ok(Math.abs(target.x) === 0);
  assert.equal(target.y, 0);
});

test('maps corners to restrained rotation limits', () => {
  const topLeft = getTarget(rect, 100, 50);
  const bottomRight = getTarget(rect, 400, 450);
  assert.equal(topLeft.x, 9);
  assert.equal(topLeft.y, -12);
  assert.equal(bottomRight.x, -9);
  assert.equal(bottomRight.y, 12);
});

test('clamps out-of-bounds and degenerate geometry to finite angles', () => {
  for (const bounds of [rect, { left: 0, top: 0, width: 0, height: 0 }]) {
    const target = getTarget(bounds, -10000, 10000);
    assert.ok(Number.isFinite(target.x) && Number.isFinite(target.y));
    assert.ok(Math.abs(target.x) <= 9 && Math.abs(target.y) <= 12);
  }
});

test('critical damping approaches the target without overshooting from rest', () => {
  let position = 0;
  let velocity = 0;
  for (let i = 0; i < 120; i += 1) {
    const next = stepSpring(position, velocity, 12, 1 / 60);
    assert.ok(next.position >= position && next.position <= 12);
    position = next.position;
    velocity = next.velocity;
  }
  assert.ok(Math.abs(position - 12) < 0.001);
  assert.ok(Math.abs(velocity) < 0.001);
});

test('spring follows the same trajectory at different refresh rates', () => {
  const low = simulate(12, 30);
  for (const hz of [60, 120, 144]) {
    const high = simulate(12, hz);
    assert.ok(Math.abs(low.position - high.position) < 1e-10);
    assert.ok(Math.abs(low.velocity - high.velocity) < 1e-10);
  }
});

test('reversing a target retains presentation position and momentum', () => {
  const first = stepSpring(0, 0, 12, 0.1);
  const reversed = stepSpring(first.position, first.velocity, -12, 1 / 240);
  assert.ok(first.velocity > 0);
  assert.ok(reversed.velocity > 0, 'momentum must not hard-cut on reversal');
  assert.ok(Math.abs(reversed.position - first.position) < 1);
  let state = reversed;
  for (let i = 0; i < 120; i += 1) state = stepSpring(state.position, state.velocity, -12, 1 / 60);
  assert.ok(Math.abs(state.position + 12) < 0.001);
});

test('uses stable scene coordinates rather than transformed card bounds', () => {
  assert.match(html, /var bounds = scene\.getBoundingClientRect\(\);/);
  assert.match(html, /left:bounds\.left \+ card\.offsetLeft/);
  assert.match(html, /top:bounds\.top \+ card\.offsetTop/);
  assert.doesNotMatch(html, /card\.getBoundingClientRect\(\)/);
});

test('stops animation on settling, leaving view, blur and motion preference changes', () => {
  assert.match(html, /if\(isSettled\(\)\)\{[\s\S]*?lastTime = 0;[\s\S]*?return;/);
  assert.match(html, /if\(frameId\) cancelAnimationFrame\(frameId\);/);
  assert.match(html, /if\(!inView\) reset\(true\);/);
  assert.match(html, /window\.addEventListener\('blur', function\(\)\{ reset\(true\); \}\);/);
  assert.match(html, /motion\.addEventListener\('change', function\(\)\{ reset\(true\); \}\);/);
  assert.match(html, /event\.pointerType !== 'mouse' \|\| !canMove\(\)/);
});

test('keeps touch and reduced-motion cards flat and provides an image-error fallback', () => {
  assert.match(html, /@media \(prefers-reduced-motion:reduce\), \(hover:none\), \(pointer:coarse\)\{\s*\.portrait__card\{transform:none !important;\}/);
  assert.match(html, /img\.addEventListener\('error', updateImageState\);/);
  assert.match(html, /portrait\.classList\.toggle\('is-image-unavailable', !img\.naturalWidth\);/);
  assert.match(html, /\.portrait\.is-image-unavailable \.portrait__img\{display:none;\}/);
  assert.match(html, /\.portrait\.is-image-unavailable \.portrait__monogram\{display:flex;\}/);
});

test('retains the approved editorial hero layout outside the portrait', () => {
  assert.match(html, /--nav-h:100px;/);
  assert.match(html, /grid-template-columns:minmax\(0,40\.6%\) minmax\(0,59\.4%\);/);
  assert.match(html, /font-size:clamp\(120px,14\.6vw,280px\);/);
  assert.match(html, /\.hero__cta \.btn\{[\s\S]*?height:72px;/);
  assert.match(html, /\.portrait\{width:min\(76vw,395\.16px\);min-height:0;aspect-ratio:3\/4;margin:0;\}/);
  assert.match(html, /\.portrait\{width:min\(100%,326\.34px\);overflow:visible;\}/);
});
