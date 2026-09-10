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
  assert.match(html, /data-github-stars="pi-agent-desktop"[\s\S]*data-github-star-count>20<\/strong>[\s\S]*PI \/ DESKTOP/);
  assert.match(html, /data-github-stars="SuperMew"[\s\S]*data-github-star-count>3<\/strong>[\s\S]*RAG \/ MEMORY/);
  assert.match(html, /data-github-stars="resume-skills"[\s\S]*data-github-star-count>10<\/strong>[\s\S]*RESUME \/ JD/);
  assert.match(html, /data-github-stars="Everything-claude-code-Doc"[\s\S]*data-github-star-count>12<\/strong>[\s\S]*ECC \/ GUIDE/);
  assert.match(html, /data-github-stars="Chasen-Skills"[\s\S]*data-github-star-count>29<\/strong>[\s\S]*SKILLS \/ TOOLING/);
  assert.doesNotMatch(html, /⭐ 19 · PI \/ DESKTOP|⭐ 3 · RESUME \/ JD/);
});

test('sends the complete portfolio link to the GitHub profile', () => {
  assert.match(
    html,
    /<a class="work__all" href="https:\/\/github\.com\/Chasen-Liao" target="_blank" rel="noopener noreferrer">完整作品集/
  );
});

test('includes Chasen-Skills in the selected portfolio', () => {
  assert.match(
    html,
    /<a class="wrow" data-cats="全部 工具链 文档 Claude Code Agent 实验" href="https:\/\/github\.com\/Chasen-Liao\/Chasen-Skills"/
  );
  assert.match(html, /Chasen-Skills — 个人 Agent Skills 集合/);
  assert.match(html, /为 Pi、Antigravity、Claude Code 打造的个人 Agent Skills 集合/);
  assert.match(html, /SELECTED PROJECTS · 05/);
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
    'Chasen-Skills',
  ]) {
    assert.match(html, new RegExp(`data-github-stars="${repo}"`));
  }
});

test('refreshes GitHub metrics from two uncached public API requests', () => {
  assert.match(html, /var count = el\.querySelector\('\[data-github-star-count\]'\);[\s\S]*?count\.textContent = repo\.stargazers_count;/);
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
