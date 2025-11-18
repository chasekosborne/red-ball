// tests/test_blackhole.js

const assert = require('node:assert/strict');
const { blackholeAttraction } = require('../src/controller/blackhole.js');

// Simple test runner (same style as other tests)
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

// Helper: distance function like p5's dist, but for Node tests
function testDist(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.hypot(dx, dy);
}

// 1) No force when ball is outside attraction field
test('blackholeAttraction: no force outside attraction field', () => {
  // Fake globals the function expects
  global.ball = { x: 0, y: 0, vel: { x: 0, y: 0 } };
  global.levelObjects = { blackhole: [ { x: 200, y: 0 } ] }; // distance 200 > 150
  global.godMode = false;
  global.globalVolume = 0.5;
  global.deathSound = null;
  global.respawn = () => {};
  global.dist = testDist;

  // Call the function
  blackholeAttraction();

  // Outside field -> no velocity change
  assert.strictEqual(ball.vel.x, 0);
  assert.strictEqual(ball.vel.y, 0);
});

// 2) Force pulls ball toward the black hole within field (but not killing)
test('blackholeAttraction: applies force within attraction field', () => {
  global.ball = { x: 0, y: 0, vel: { x: 0, y: 0 } };
  global.levelObjects = { blackhole: [ { x: 100, y: 0 } ] }; // distance 100 < 150, > 60
  global.godMode = false;
  global.globalVolume = 0.5;
  global.deathSound = null;
  global.respawn = () => {};
  global.dist = testDist;

  blackholeAttraction();

  // dx = 100 -> forceOnX = (1.2 * 100) / 100 = 1.2
  assert.ok(Math.abs(ball.vel.x - 1.2) < 1e-9);
  assert.strictEqual(ball.vel.y, 0);
});

// 3) Too close -> respawn + sound
test('blackholeAttraction: triggers respawn and death sound when too close', () => {
  global.ball = { x: 0, y: 0, vel: { x: 0, y: 0 } };
  global.levelObjects = { blackhole: [ { x: 0, y: 30 } ] }; // distance 30 < 60
  global.godMode = false;
  global.globalVolume = 0.5;

  let respawnCalled = false;
  let soundPlayed = false;

  global.deathSound = {
    isLoaded: () => true,
    setVolume: (v) => {
      // Optional: assert on v === globalVolume * 0.25
      assert.ok(v > 0 && v <= global.globalVolume, 'volume should be scaled from globalVolume');
    },
    play: () => {
      soundPlayed = true;
    },
  };

  global.respawn = () => {
    respawnCalled = true;
  };

  global.dist = testDist;

  blackholeAttraction();

  assert.ok(respawnCalled, 'respawn should be called');
  assert.ok(soundPlayed, 'death sound should be played');
});

console.log('All black hole tests completed.');
