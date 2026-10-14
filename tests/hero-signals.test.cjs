const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const html = fs.readFileSync(path.resolve(__dirname, '..', 'index.html'), 'utf8');

function signalHarness({ observe = true, missing = false } = {}) {
  const marker = 'function initHeroSignals(';
  const start = html.indexOf(marker);
  assert.notEqual(start, -1);
  const bodyStart = html.indexOf('{', start);
  let depth = 0;
  let source;
  for (let i = bodyStart; i < html.length; i += 1) {
    if (html[i] === '{') depth += 1;
    if (html[i] === '}') depth -= 1;
    if (depth === 0) { source = html.slice(start, i + 1); break; }
  }
  const events = {};
  const state = { active: false };
  const motion = { matches: false, addEventListener(type, handler) { events.motion = handler; } };
  const hero = {};
  const signals = { classList: { toggle(name, enabled) { assert.equal(name, 'is-active'); state.active = enabled; } } };
  const document = {
    hidden: false,
    getElementById: () => hero,
    querySelector: () => missing ? null : signals,
    addEventListener(type, handler) { events[type] = handler; },
  };
  class IntersectionObserver {
    constructor(callback) { events.intersection = callback; }
    observe(element) { assert.equal(element, hero); }
  }
  const window = { matchMedia: () => motion };
  if (observe) window.IntersectionObserver = IntersectionObserver;
  const init = vm.runInNewContext(`(${source})`, { window, document, IntersectionObserver });
  init();
  return { state, events, motion, document };
}

test('uses four decorative corner traces and two separate bottom buses', () => {
  const hero = html.slice(html.indexOf('<section class="hero"'), html.indexOf('<!-- ═══════════ 02 ABOUT'));
  assert.match(hero, /data-hero-signals aria-hidden="true"/);
  assert.equal((hero.match(/<div class="hero__trace hero__trace--/g) || []).length, 4);
  assert.equal((hero.match(/<span class="hero__bus hero__bus--/g) || []).length, 2);
  assert.doesNotMatch(hero, /tabindex|<canvas/);
  assert.match(hero, /<symbol id="hero-corner-circuit"/);
});

test('adds eleven percent to the previous card size while keeping a height cap', () => {
  const size = html.match(/width:min\(([\d.]+)%,([\d.]+)px,calc\(\(100svh - var\(--nav-h\) - 28px - 8vh - 24px\) \* \.75\)\);/);
  assert.ok(size, 'responsive card dimensions and safe height cap should exist');
  assert.ok(Math.abs(Number(size[1]) / 72 - 1.11) < 1e-10);
  assert.ok(Math.abs(Number(size[2]) / 480 - 1.11) < 1e-10);
});

test('starts static and plays only after the hero enters the viewport', () => {
  const { state, events } = signalHarness();
  assert.equal(state.active, false);
  events.intersection([{ isIntersecting: true }]);
  assert.equal(state.active, true);
  events.intersection([{ isIntersecting: false }]);
  assert.equal(state.active, false);
});

test('pauses when hidden and resumes only while still in view', () => {
  const { state, events, document } = signalHarness();
  events.intersection([{ isIntersecting: true }]);
  document.hidden = true; events.visibilitychange();
  assert.equal(state.active, false);
  document.hidden = false; events.visibilitychange();
  assert.equal(state.active, true);
  events.intersection([{ isIntersecting: false }]);
  document.hidden = true; events.visibilitychange();
  document.hidden = false; events.visibilitychange();
  assert.equal(state.active, false);
});

test('responds to live reduced-motion changes without overriding viewport state', () => {
  const { state, events, motion } = signalHarness();
  events.intersection([{ isIntersecting: true }]);
  motion.matches = true; events.motion();
  assert.equal(state.active, false);
  motion.matches = false; events.motion();
  assert.equal(state.active, true);
  events.intersection([{ isIntersecting: false }]);
  motion.matches = true; events.motion();
  motion.matches = false; events.motion();
  assert.equal(state.active, false);
});

test('degrades to static without an observer or when decoration is absent', () => {
  const { state } = signalHarness({ observe: false });
  assert.equal(state.active, false);
  assert.doesNotThrow(() => signalHarness({ missing: true }));
});

test('adds bounded corner grains and short lines without spreading across the hero', () => {
  assert.equal((html.match(/<i class="hero__grain(?: hero__grain--cross)?"/g) || []).length, 8);
  assert.equal((html.match(/<i class="hero__bus-dust"/g) || []).length, 2);
  const specks = html.match(/<g class="hero__trace-specks"[^>]*>([\s\S]*?)<\/g>/);
  assert.ok(specks);
  assert.equal((specks[1].match(/<rect /g) || []).length, 12);
  assert.match(html, /M30 82V48L48 30H82 M38 66V52L52 38H66/);
  assert.match(html, /width:144px;height:144px;/);
  assert.match(html, /\.hero__trace\{width:96px;height:96px;/);
  assert.match(html, /overflow:hidden;pointer-events:none;/);
  assert.match(html, /left 13px\/18px 3px repeat-x/);
});

test('new grains animate only transform and opacity and honor reduced motion', () => {
  for (const name of ['hero-grain-drift', 'hero-bus-dust']) {
    assert.ok(html.includes('animation:' + name + ' 12s linear infinite'));
    const keyframes = html.match(new RegExp('@keyframes ' + name + '\\{([\\s\\S]*?)\\n    \\}'));
    assert.ok(keyframes);
    const properties = new Set([...keyframes[1].matchAll(/([a-z-]+):/g)].map(match => match[1]));
    assert.deepEqual([...properties].sort(), ['opacity', 'transform']);
  }
  assert.match(html, /animation-delay:var\(--grain-phase,0s\);animation-play-state:paused;/);
  assert.match(html, /\.hero__grain,\.hero__bus-dust\{animation:none !important;opacity:0 !important;\}/);
});

test('makes signals more visible without changing their slow timing', () => {
  assert.match(html, /color:var\(--muted\);opacity:\.55;/);
  assert.match(html, /width:26px;height:2px;/);
  assert.match(html, /width:36px;height:2px;/);
  assert.match(html, /opacity:\.95;transform:translateX\(0\)/);
});

test('staggered eight-second CSS pulses use no JavaScript animation loop', () => {
  assert.match(html, /animation:hero-corner-signal 8s linear infinite;/);
  assert.match(html, /animation:hero-bus-signal 8s linear infinite;/);
  for (const delay of [2, 4, 6]) assert.match(html, new RegExp(`hero__trace--[^}]+animation-delay:${delay}s;`));
  const start = html.indexOf('(function initHeroSignals()');
  const end = html.indexOf('// 镭射闪卡', start);
  assert.doesNotMatch(html.slice(start, end), /requestAnimationFrame|setInterval|pointermove/);
  assert.match(html, /\.hero__trace-pulse,\.hero__bus-pulse\{animation:none !important;opacity:0 !important;\}/);
  const active = html.match(/\.hero__signals\.is-active \.hero__trace-pulse,([\s\S]*?)\{animation-play-state:running;\}/);
  assert.ok(active);
  for (const name of ['hero__bus-pulse', 'hero__grain', 'hero__bus-dust']) {
    assert.ok(active[1].includes('.hero__signals.is-active .' + name));
  }
});
