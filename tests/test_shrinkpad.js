// tests/test_shrinkpad.js
/*
  Tests shrinkpad.js behavior:

  - reset():
    • initializes ball.baseScale, sizeState, and scale to "Normal"
    • clears internal touching set and sets grace period

  - update():
    • ignores when no ball or no pads
    • ignores pads while godMode is true
    • respects initial grace period after reset
    • toggles ball size Normal ↔ Small on first contact
    • uses pad.__triggerR when provided
    • enforces per-pad cooldown and edge-trigger:
      - no retrigger while staying on pad
      - leaving pad clears state
      - re-entering before cooldown does nothing
      - re-entering after cooldown toggles again
*/
const assert = require('node:assert/strict');

// We'll stub millis() and window in tests; ShrinkPad uses them internally
let nowMs = 0;
global.window = global.window || {};
global.millis = () => nowMs;

const ShrinkPad = require('../src/controller/shrinkpad.js');
const { reset, update } = ShrinkPad;

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

// reset environment before each test
function resetEnv() {
  nowMs = 0;
  global.window = global.window || {};
  global.millis = () => nowMs;
  delete global.godMode; // let typeof godMode === 'undefined'
}

// ---------- Tests ----------

test('reset initializes ball size to Normal and scale to baseScale', () => {
  resetEnv();

  const ball = { x: 0, y: 0 }; // no baseScale / sizeState yet

  nowMs = 1000;
  reset(ball);

  assert.equal(ball.baseScale, 1);
  assert.equal(ball.sizeState, 'Normal');
  assert.equal(ball.scale, 1);
});

test('update safely handles missing ball or pads', () => {
  resetEnv();

  nowMs = 1000;
  reset(null);

  // just make sure these calls do not throw
  assert.doesNotThrow(() => {
    update(null, null);
    update({}, null);
    update(null, []);
  });
});

test('update ignores pads completely when godMode is true', () => {
  resetEnv();

  const ball = { x: 0, y: 0 };
  const pad = { x: 0, y: 0 };

  nowMs = 1000;
  reset(ball);

  // skip grace period
  nowMs = 100000;
  global.godMode = true;

  // Run update — _ensurePlayerInit should run, but pad should not trigger
  update(ball, [pad]);

  // The pad should NOT toggle size, but ball initialization still happens.
  assert.equal(ball.sizeState, 'Normal');  // stays as initialized
  assert.equal(ball.scale, 1);             // stays unchanged
});

test('update respects grace period after reset (no toggle until time passes)', () => {
  resetEnv();

  const ball = { x: 0, y: 0 };
  const pad = { x: 0, y: 0, __triggerR: 50 };

  // call reset at time 1000
  nowMs = 1000;
  reset(ball);

  // immediately try to use pad → still in grace period
  update(ball, [pad]);
  assert.equal(ball.sizeState, 'Normal');
  assert.equal(ball.scale, 1);

  // jump far into the future to ensure grace period has expired
  nowMs = 100000;
  update(ball, [pad]);

  // first toggle should have happened: Normal -> Small
  assert.equal(ball.sizeState, 'Small');
  assert.ok(ball.scale < 1); // SMALL_SCALE < 1
});

test('update uses pad.__triggerR when provided', () => {
  resetEnv();

  const ball = { x: 9, y: 0 }; // distance 9 from pad
  const pad = { x: 0, y: 0, __triggerR: 10 };

  nowMs = 0;
  reset(ball);

  // skip grace period
  nowMs = 100000;
  update(ball, [pad]);

  // within radius 10, should toggle to Small
  assert.equal(ball.sizeState, 'Small');

  // move outside radius (distance 12 > 10) and update
  ball.x = 12;
  update(ball, [pad]);

  // leaving pad doesn't change size, just internal touching state
  assert.equal(ball.sizeState, 'Small');
});

test('pad toggles size once per entry and respects cooldown', () => {
  resetEnv();

  const ball = { x: 0, y: 0 };
  const pad = { x: 0, y: 0, __triggerR: 50 };

  nowMs = 0;
  reset(ball);

  // ensure grace period is long past
  nowMs = 100000;

  // First entry: should toggle Normal -> Small
  update(ball, [pad]);
  assert.equal(ball.sizeState, 'Small');
  const firstScale = ball.scale;
  const cooldownUntil = pad.__cooldownUntil;
  assert.ok(cooldownUntil > nowMs);

  // Still on pad, same time: no retrigger
  update(ball, [pad]);
  assert.equal(ball.sizeState, 'Small');
  assert.equal(ball.scale, firstScale);

  // Move off pad: should clear internal touching state
  ball.x = 1000;
  nowMs = cooldownUntil - 1; // still before cooldown expires
  update(ball, [pad]);
  assert.equal(ball.sizeState, 'Small');

  // Move back on pad BEFORE cooldown ends → still no toggle
  ball.x = 0;
  update(ball, [pad]);
  assert.equal(ball.sizeState, 'Small');

  // Advance time to cooldown expiration and re-enter
  nowMs = cooldownUntil;
  update(ball, [pad]);

  // Now we should toggle Small -> Normal
  assert.equal(ball.sizeState, 'Normal');
  assert.equal(ball.scale, ball.baseScale);
});

