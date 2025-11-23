// tests/test_teleporter.js
/*
  Tests teleporter.js teleportation() behavior:

  - Does nothing when ball is missing
  - When teleporterActive is true and ball is near teleporter[0],
    moves ball to teleporter[1], plays sound, and starts cooldown
  - When ball is near teleporter[1], moves ball back to teleporter[0]
  - Ignores teleport when teleporterActive is false and cooldown not expired
  - After 3 seconds (3000 ms) since beginTime, teleporter becomes active again
*/
const assert = require('node:assert/strict');

const { teleportation } = require('../src/controller/teleporter.js');

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

let nowMs = 0;

function resetEnv() {
  nowMs = 0;

  global.ball = null;
  global.levelObjects = {
    teleporter: [
      { x: 0,   y: 0 },
      { x: 100, y: 200 }
    ]
  };

  // p5-style distance
  global.dist = (x1, y1, x2, y2) => {
    const dx = x1 - x2;
    const dy = y1 - y2;
    return Math.sqrt(dx * dx + dy * dy);
  };

  global.globalVolume = 1.0;

  // teleport sound stub (overridden per test if needed)
  global.teleportSound = {
    isLoaded: () => true,
    setVolume: () => {},
    play: () => {}
  };

  // teleporter state globals from teleporter.js
  global.teleporterActive = true;
  global.beginTime = 0;

  // p5 millis()
  global.millis = () => nowMs;
}

// ---------- Tests ----------

test('teleportation does nothing when ball is null', () => {
  resetEnv();

  global.ball = null;
  nowMs = 5000;
  global.teleporterActive = true;

  assert.doesNotThrow(() => {
    teleportation();
  });

  // just sanity-check: teleporterActive unchanged
  assert.equal(global.teleporterActive, true);
});

test('ball near first teleporter moves to second and starts cooldown', () => {
  resetEnv();

  // ball very close to teleporter[0]
  global.ball = { x: 1, y: 1 };
  nowMs = 5000;
  global.teleporterActive = true;

  let volumeSet = null;
  let playCount = 0;

  global.teleportSound = {
    isLoaded: () => true,
    setVolume: v => { volumeSet = v; },
    play: () => { playCount++; }
  };
  global.globalVolume = 0.8;

  teleportation();

  // ball should now be at teleporter[1]
  assert.equal(global.ball.x, global.levelObjects.teleporter[1].x);
  assert.equal(global.ball.y, global.levelObjects.teleporter[1].y);

  // teleporter becomes inactive and beginTime logged
  assert.equal(global.teleporterActive, false);
  assert.equal(global.beginTime, nowMs);

  // sound should have played with scaled volume
  assert.equal(playCount, 1);
  assert.equal(volumeSet, 0.8 * 0.25);
});

test('ball near second teleporter moves back to first', () => {
  resetEnv();

  // ball close to teleporter[1]
  global.ball = { x: 101, y: 199 }; // within 45 pixels
  nowMs = 6000;
  global.teleporterActive = true;

  let playCount = 0;
  global.teleportSound = {
    isLoaded: () => true,
    setVolume: () => {},
    play: () => { playCount++; }
  };

  teleportation();

  // ball should now be at teleporter[0]
  assert.equal(global.ball.x, global.levelObjects.teleporter[0].x);
  assert.equal(global.ball.y, global.levelObjects.teleporter[0].y);

  assert.equal(global.teleporterActive, false);
  assert.equal(global.beginTime, nowMs);
  assert.equal(playCount, 1);
});

test('teleportation ignored when teleporterActive is false and cooldown not expired', () => {
  resetEnv();

  // ball near teleporter[0]
  global.ball = { x: 2, y: 2 };

  // simulate we just teleported recently
  global.teleporterActive = false;
  global.beginTime = 1000;
  nowMs = 2000; // only 1000 ms after, cooldown = 3000

  let playCount = 0;
  global.teleportSound = {
    isLoaded: () => true,
    setVolume: () => {},
    play: () => { playCount++; }
  };

  const originalX = global.ball.x;
  const originalY = global.ball.y;

  teleportation();

  // ball should not have been moved
  assert.equal(global.ball.x, originalX);
  assert.equal(global.ball.y, originalY);

  // still in cooldown
  assert.equal(global.teleporterActive, false);
  assert.equal(playCount, 0);
});

test('teleporter reactivates after 3000 ms cooldown', () => {
  resetEnv();

  // ball position doesn't matter for cooldown, just need teleporters present
  global.ball = { x: 1000, y: 1000 };

  global.teleporterActive = false;
  global.beginTime = 1000;

  // just before cooldown expires
  nowMs = 3999; // 3999 - 1000 = 2999 < 3000
  teleportation();
  assert.equal(global.teleporterActive, false);

  // at / after cooldown threshold
  nowMs = 4000; // 4000 - 1000 = 3000
  teleportation();
  assert.equal(global.teleporterActive, true);
});

