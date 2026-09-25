import assert from 'node:assert/strict';
import test from 'node:test';
import { lintVoice } from '../src/lint.ts';

test('clean lowercase text has no flags', () => {
  assert.deepEqual(lintVoice("hey, i'm working on it. i'll send it tomorrow.", 'text'), []);
});

test('finds hard punctuation and AI residue', () => {
  const issues = lintVoice('Here\u2019s your rewrite \u2014 I will leverage synergy. Want me to adjust anything?', 'default');
  assert.ok(issues.some((issue) => issue.includes('em/en dash')));
  assert.ok(issues.some((issue) => issue.includes('curly quotes')));
  assert.ok(issues.some((issue) => issue.includes('ai vocabulary')));
  assert.ok(issues.some((issue) => issue.includes('chatbot style')));
});

test('respects register-specific casing and bold limits', () => {
  assert.ok(lintVoice('i can send it tomorrow.', 'pro').some((issue) => issue.includes("lowercase 'i'")));
  assert.ok(lintVoice('I can send it tomorrow.', 'default').some((issue) => issue.includes("capital 'I'")));
  assert.ok(lintVoice('**hello**', 'text').some((issue) => issue.includes('bold spans')));
});

test('ignores code and URLs for punctuation lint', () => {
  assert.deepEqual(lintVoice('see `foo -- bar` and https://example.com/a--b', 'text'), []);
});
