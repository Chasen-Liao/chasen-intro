const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

test('uses the current GitHub profile totals everywhere', () => {
  assert.match(html, />52 REPOS · ⌀</);
  assert.match(html, />88 FOLLOWERS</);
  assert.match(
    html,
    /@Chasen-Liao <em data-github-profile-label>52 repos · 88 followers<\/em>/
  );
  assert.doesNotMatch(html, /51 REPOS|51 repos|87 FOLLOWERS|87 followers/);
});

test('uses the current stars for every selected GitHub project', () => {
  assert.match(html, /⭐ 20 · PI \/ DESKTOP/);
  assert.match(html, /⭐ 3 · RAG \/ MEMORY/);
  assert.match(html, /⭐ 10 · RESUME \/ JD/);
  assert.match(html, /⭐ 12 · ECC \/ GUIDE/);
  assert.doesNotMatch(html, /⭐ 19 · PI \/ DESKTOP|⭐ 3 · RESUME \/ JD/);
});

test('sends the complete portfolio link to the GitHub profile', () => {
  assert.match(
    html,
    /<a class="work__all" href="https:\/\/github\.com\/Chasen-Liao" target="_blank" rel="noopener noreferrer">完整作品集/
  );
});

test('marks every GitHub metric as a live-updatable field', () => {
  assert.match(html, /data-github-repos-label/);
  assert.match(html, /data-github-followers-label/);
  assert.match(html, /data-github-profile-label/);
  for (const repo of [
    'pi-agent-desktop',
    'SuperMew',
    'resume-skills',
    'Everything-claude-code-Doc',
  ]) {
    assert.match(html, new RegExp(`data-github-stars="${repo}"`));
  }
});

test('refreshes GitHub metrics from two uncached public API requests', () => {
  assert.match(
    html,
    /fetch\('https:\/\/api\.github\.com\/users\/Chasen-Liao',\{cache:'no-store'/
  );
  assert.match(
    html,
    /fetch\('https:\/\/api\.github\.com\/users\/Chasen-Liao\/repos\?per_page=100',\{cache:'no-store'/
  );
  assert.match(html, /Promise\.all\(\[userRequest,reposRequest\]\)/);
});

test('keeps the static GitHub snapshot when live requests fail', () => {
  assert.match(html, /\.catch\(function\(\)\{\s*\/\* Keep the verified static snapshot\. \*\/\s*\}\);/);
});
