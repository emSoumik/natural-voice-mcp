import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import test from 'node:test';
import { playbook } from '../src/playbook.ts';
import { lintVoice, type Register } from '../src/lint.ts';

const referenceFiles = [
  'SKILL.md',
  'references/voice-profile.md',
  'references/registers.md',
  'references/ai-tells.md',
  'references/word-bank.md',
  'references/examples.md',
];

test('MCP guidance is generated from the complete plugin skill', () => {
  for (const file of referenceFiles) {
    const path = `skills/natural-voice/${file}`;
    assert.ok(playbook.includes(`===== ${path} =====`), `${path} is missing from MCP bundle`);
    assert.ok(playbook.includes(readFileSync(path, 'utf8')), `${path} has stale bundled content`);
  }
  assert.equal(readFileSync('assets/icon.svg', 'utf8'), readFileSync('skills/natural-voice/assets/icon.svg', 'utf8'));
});

test('MCP lint agrees with the bundled Python checker on representative drafts', () => {
  const cases: Array<[string, Register]> = [
    ["hey, i'm working on it. i'll send it tomorrow.", 'text'],
    ['Here’s your rewrite — I will leverage synergy. Want me to adjust anything?', 'default'],
    ['**hello**', 'text'],
    ['i can send it tomorrow.', 'pro'],
    ['one. two. three. four. five.', 'default'],
  ];
  for (const [draft, register] of cases) {
    let output: string;
    try {
      output = execFileSync('python3', ['skills/natural-voice/scripts/check.py', '--register', register], {
        input: draft,
        encoding: 'utf8',
      });
    } catch (error) {
      output = (error as { stdout: string }).stdout;
    }
    const pythonIssues = output.split('\n').filter((line) => line.startsWith('  - ')).map((line) => line.slice(4));
    assert.deepEqual(lintVoice(draft, register), pythonIssues, `checker mismatch for ${register}: ${draft}`);
  }
});
