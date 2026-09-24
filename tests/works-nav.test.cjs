const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const works = fs.readFileSync(path.join(__dirname, '..', 'works.html'), 'utf8');

test('lists the confirmed live destinations and an updating status', () => {
  assert.match(works, /href="https:\/\/chasen-liao\.github\.io\/pi-agent-desktop\/"/);
  assert.match(works, /href="https:\/\/chasen-liao\.github\.io\/FOMO\/"/);
  assert.match(works, /href="https:\/\/chasen-clog\.cc\.cd\/"/);
  assert.match(works, /持续更新中/);
  assert.doesNotMatch(works, /chasenclog\.vercel\.app|github\.com\/Chasen-Liao\/pi-agent-desktop/);
});
