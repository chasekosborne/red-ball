// tests/test_checkpoint.js

const assert = require('node:assert/strict');
const { CheckPoint, BacktrackTrigger } = require('../src/controller/checkpoint.js');

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

// ---- Minimal Sprite stub for tests ----
global.Sprite = class {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.visible = true;
    this.collider = 'dynamic';
    this.rotationLock = false;
    this.img = null;
    this.removed = false;
  }

  remove() {
    this.removed = true;
  }

  // Default: no overlap; individual tests can override
  overlapping(other) {
    return false;
  }
};

// ---- Globals used by checkpoint code ----
global.unclaimedFlagImage = { id: 'unclaimed' };
global.claimedFlagImage = { id: 'claimed' };
global.globalVolume = 0.5;
global.checkSound = null;        // can be overridden in sound tests
global.respawnPosition = null;   // will be set by CheckPoint.update()

// 1) CheckPoint constructor initializes sprite + state
test('CheckPoint: constructor sets sprite and initial state', () => {
  const fakePlayer = {};
  const cp = new CheckPoint(100, 200, fakePlayer);

  assert.strictEqual(cp.player, fakePlayer);
  assert.strictEqual(cp.claimed, false);
  assert.strictEqual(cp.sprite.x, 100);
  assert.strictEqual(cp.sprite.y, 200);
  assert.strictEqual(cp.sprite.collider, 'none');
  assert.strictEqual(cp.sprite.rotationLock, true);
  assert.strictEqual(cp.sprite.img, unclaimedFlagImage);
});

// 2) reset() clears claimed and restores unclaimed flag image
test('CheckPoint: reset clears claimed and restores flag image', () => {
  const cp = new CheckPoint(100, 200, {});
  cp.claimed = true;
  cp.sprite.img = claimedFlagImage;

  cp.reset();

  assert.strictEqual(cp.claimed, false);
  assert.strictEqual(cp.sprite.img, unclaimedFlagImage);
});

// 3) update() claims when overlapping and sets respawnPosition + plays sound
test('CheckPoint: update claims on overlap and sets respawnPosition', () => {
  const fakePlayer = {};
  const cp = new CheckPoint(100, 200, fakePlayer);

  // Make sprite "overlap" the player
  cp.sprite.overlapping = () => true;

  let soundPlayed = false;
  global.checkSound = {
    isLoaded: () => true,
    play: (startTime, rate, volume, panning, amp) => {
      soundPlayed = true;
      // optional: you could assert on these arguments if you want
    },
  };

  global.respawnPosition = null;

  cp.update();

  assert.strictEqual(cp.claimed, true);
  assert.strictEqual(cp.sprite.img, claimedFlagImage);

  // respawn point is at [x, y - 10]
  assert.deepStrictEqual(respawnPosition, [100, 190]);

  assert.ok(soundPlayed, 'checkpoint sound should be played');
});

// 4) update() does nothing if already claimed
test('CheckPoint: update does nothing when already claimed', () => {
  const fakePlayer = {};
  const cp = new CheckPoint(100, 200, fakePlayer);

  cp.claimed = true;
  cp.sprite.img = claimedFlagImage;
  cp.sprite.overlapping = () => true;

  global.respawnPosition = null;

  // Track if sound gets played
  let soundPlayed = false;
  global.checkSound = {
    isLoaded: () => true,
    play: () => {
      soundPlayed = true;
    },
  };

  cp.update();

  // Still claimed, same image, respawnPosition untouched, no sound
  assert.strictEqual(cp.claimed, true);
  assert.strictEqual(cp.sprite.img, claimedFlagImage);
  assert.strictEqual(respawnPosition, null);
  assert.strictEqual(soundPlayed, false);
});

// 5) BacktrackTrigger constructor sets sprite properties
test('BacktrackTrigger: constructor sets sprite and initial state', () => {
  const fakePlayer = {};
  const bt = new BacktrackTrigger(50, 60, 70, 80, fakePlayer);

  assert.strictEqual(bt.player, fakePlayer);
  assert.strictEqual(bt.checkpointsReset, false);
  assert.deepStrictEqual(bt.checkpoints, []);

  assert.strictEqual(bt.sprite.x, 50);
  assert.strictEqual(bt.sprite.y, 60);
  assert.strictEqual(bt.sprite.w, 70);
  assert.strictEqual(bt.sprite.h, 80);

  assert.strictEqual(bt.sprite.visible, false);
  assert.strictEqual(bt.sprite.collider, 'none');
  assert.strictEqual(bt.sprite.rotationLock, true);
});

// 6) BacktrackTrigger resetCheckpoints() calls reset on each checkpoint
test('BacktrackTrigger: resetCheckpoints calls reset on each checkpoint', () => {
  const bt = new BacktrackTrigger(0, 0, 10, 10, {});

  let c1Reset = false;
  let c2Reset = false;

  const cp1 = { reset: () => { c1Reset = true; } };
  const cp2 = { reset: () => { c2Reset = true; } };

  bt.setCheckpoints([cp1, cp2]);

  bt.resetCheckpoints();

  assert.ok(c1Reset, 'first checkpoint should be reset');
  assert.ok(c2Reset, 'second checkpoint should be reset');
});

// 7) BacktrackTrigger update() resets checkpoints on first overlap only once
test('BacktrackTrigger: update resets checkpoints once on overlap', () => {
  const fakePlayer = {};
  const bt = new BacktrackTrigger(0, 0, 10, 10, fakePlayer);

  let resetCount = 0;
  const cp = {
    reset: () => {
      resetCount += 1;
    },
  };

  bt.setCheckpoints([cp]);

  // Make sprite overlap player
  bt.sprite.overlapping = () => true;

  // First update: should reset checkpoints
  bt.update();
  assert.strictEqual(bt.checkpointsReset, true);
  assert.strictEqual(resetCount, 1);

  // Second update: still overlapping, but checkpointsReset is true so no more resets
  bt.update();
  assert.strictEqual(resetCount, 1, 'checkpoints should not be reset again');
});

console.log('All checkpoint tests completed.');
