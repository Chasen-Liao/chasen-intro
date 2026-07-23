const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

test('opens the site in social mode by default', () => {
  assert.match(html, /<body data-mode="social">/);
  assert.match(
    html,
    /<span class="mode-capsule__opt is-active" data-capsule="social">/
  );
  assert.match(html, /var savedMode = 'social';/);
});

test('uses the public X positioning in the social introduction', () => {
  assert.match(html, /AI 原住民 × VIBE CODING \/ AGENT BUILDER/);
  assert.match(
    html,
    /分享 Claude Code 使用技巧、AI 前沿动态与 Vibe Coding 实战工作流。/
  );
  assert.match(
    html,
    /AI 原住民和 Vibe Coding \/ AI Agent 实战玩家/
  );
  assert.match(html, /Claude Code、Codex 与 Agent 工作流/);
});

test('gives social visitors a direct X call to action', () => {
  assert.match(
    html,
    /data-social[^>]*>[\s\S]*?href="https:\/\/x\.com\/chasen_liao"[\s\S]*?>关注 X/
  );
  assert.match(html, /href="#work"[^>]*>浏览构建记录/);
});

test('shows the current public follower count on the X contact card', () => {
  assert.match(
    html,
    /@chasen_liao <em data-x-followers="1120">1,120 followers · build log<\/em>/
  );
});

test('includes daily AI coding tools in the signal station', () => {
  assert.match(
    html,
    /<div class="skill__name">Claude Code <em>daily<\/em><\/div>[\s\S]*?<div class="skill__level">CORE<\/div>[\s\S]*?<div class="skill__years">DAILY<\/div>/
  );
  assert.match(
    html,
    /<div class="skill__name">OpenAI Codex <em>agent<\/em><\/div>[\s\S]*?<div class="skill__level">ACTIVE<\/div>[\s\S]*?<div class="skill__years">DAILY<\/div>/
  );
});
