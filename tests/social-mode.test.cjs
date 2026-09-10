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
    /分享 Pi Agent、Codex、Claude Code 使用技巧、AI 前沿动态与 Vibe Coding 实战工作流。/
  );
  assert.match(
    html,
    /AI 原住民和 Vibe Coding \/ AI Agent 实战玩家/
  );
  assert.match(html, /Pi Agent、Codex、Claude Code 与 Agent 工作流/);
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
    /@chasen_liao <em data-x-followers="3700">3\.7k followers · build log<\/em>/
  );
});

test('keeps the displayed WeChat account and copy payload in sync', () => {
  assert.match(html, /data-copy="lcz18318288755" aria-label="复制微信号 lcz18318288755"/);
  assert.match(html, />lcz18318288755 <em data-copy-hint>点击复制<\/em>/);
  assert.doesNotMatch(html, /data-copy="chasen_liao"/);
  assert.match(html, /href="https:\/\/x\.com\/chasen_liao"/);
});

test('includes daily AI coding tools in the signal station', () => {
  assert.match(
    html,
    /<div class="skill__name">Pi Agent <em>daily<\/em><\/div>[\s\S]*?<div class="skill__level">CORE<\/div>[\s\S]*?<div class="skill__years">DAILY<\/div>/
  );
  assert.match(
    html,
    /<div class="skill__name">Claude Code <em>daily<\/em><\/div>[\s\S]*?<div class="skill__level">CORE<\/div>[\s\S]*?<div class="skill__years">DAILY<\/div>/
  );
  assert.match(
    html,
    /<div class="skill__name">OpenAI Codex <em>agent<\/em><\/div>[\s\S]*?<div class="skill__level">ACTIVE<\/div>[\s\S]*?<div class="skill__years">DAILY<\/div>/
  );
});
