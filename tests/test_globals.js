// tests/test_sample.js

const assert = require('node:assert/strict');
const {
  difficulty,
  globalVolume,
  musicVolume,
  BG_SKY,
  BG_SPACE,
  godMode,
} = require('../src/model/globals.js');


function test(name, fn) {
  try {
    fn();
    console.log(`✔ ${name}`);
  } catch (err) {
    console.error(`✖ ${name}`);
    console.error(err);
    process.exitCode = 1;
  }
}

// --- Tests for globals.js ---
test('difficulty default', () => {
  assert.strictEqual(difficulty, 'normal');
});

test('volume ranges', () => {
  assert.ok(globalVolume >= 0 && globalVolume <= 1);
  assert.ok(musicVolume >= 0 && musicVolume <= 1);
});

test('background constants', () => {
  assert.strictEqual(BG_SKY, 'sky');
  assert.strictEqual(BG_SPACE, 'space');
});

test('godMode default', () => {
  assert.strictEqual(godMode, false);
});

console.log('All global tests completed.');
