// tests/test_gamestate.js
/*
  Tests GameHandler singleton and pause state:

  - getInstance() always returns the same object
  - global gameHandler is that same instance
  - paused defaults to false
  - pauseGame() sets paused true and isPaused() reflects it
  - resumeGame() sets paused false and isPaused() reflects it
*/
const assert = require('node:assert/strict');

const { GameHandler, gameHandler } = require('../src/controller/gamestate.js');

// local test helper
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

test('GameHandler.getInstance returns the same instance', () => {
    const a = GameHandler.getInstance();
    const b = GameHandler.getInstance();
    assert.strictEqual(a, b);
});

test('global gameHandler is the same singleton instance', () => {
    const inst = GameHandler.getInstance();
    assert.strictEqual(gameHandler, inst);
});

test('game starts unpaused by default', () => {
    // we assume this is the first time we check it
    const inst = GameHandler.getInstance();
    assert.equal(inst.isPaused(), false);
});

test('pauseGame sets paused to true', () => {
    const inst = GameHandler.getInstance();

    // ensure a known starting state
    inst.resumeGame();
    assert.equal(inst.isPaused(), false);

    inst.pauseGame();
    assert.equal(inst.isPaused(), true);
});

test('resumeGame sets paused to false', () => {
    const inst = GameHandler.getInstance();

    // ensure a known starting state
    inst.pauseGame();
    assert.equal(inst.isPaused(), true);

    inst.resumeGame();
    assert.equal(inst.isPaused(), false);
});

