// tests/test_utils.js
/*
  Tests utils.js helpers:

  - forceClean():
    • calls clear() and allSprites.remove()

  - randomColor():
    • picks a color from the allowed list
    • writes levels[currentLevel].ballColor and ball.color

  - formatTime():
    • formats seconds as MM:SS using floor() and nf()

  - sleep():
    • returns a Promise

  - updateObstacles():
    • calls blackholeAttraction(), teleportation(), and ShrinkPad.update()
    • sets platform.physics = KINEMATIC and default speed
    • moves moving platforms and carries ball along
    • handles disappearingPlatforms fade logic
    • triggers spring bounce & sound (when not in godMode)
    • calls respawn() on spikes and enemies
    • updates swingingHammer position/rotation
    • calls checkpoint.update() and backtrackTrigger.update()
*/
const assert = require('node:assert/strict');

const {
  forceClean,
  randomColor,
  formatTime,
  sleep,
  updateObstacles
} = require('../src/controller/utils.js');

// Local test helper
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

// ---------- forceClean tests ----------

test('forceClean calls clear and allSprites.remove', () => {
  let cleared = 0;
  let removed = 0;

  global.clear = () => { cleared++; };
  global.allSprites = { remove: () => { removed++; } };

  forceClean();

  assert.equal(cleared, 1);
  assert.equal(removed, 1);
});

// ---------- randomColor tests ----------

test('randomColor sets level ballColor and ball.color from allowed list', () => {
  const allowed = ['red', 'black', 'purple', 'pink', 'yellow', 'green', 'blue'];

  // stub p5 random(array) to return the first entry
  global.random = (arr) => {
    if (Array.isArray(arr)) return arr[0];
    return arr;
  };

  global.levels = [{ ballColor: null }];
  global.currentLevel = 0;
  global.ball = { color: null };

  randomColor();

  assert.equal(global.levels[0].ballColor, 'red');
  assert.equal(global.ball.color, 'red');
  assert.ok(allowed.includes(global.ball.color));
});

// ---------- formatTime tests ----------

test('formatTime formats seconds as MM:SS', () => {
  // p5 stubs
  global.floor = Math.floor;
  global.nf = (num, digits) => String(num).padStart(digits, '0');

  const t1 = formatTime(0);      // 0:00
  const t2 = formatTime(7);      // 0:07
  const t3 = formatTime(125);    // 2:05

  assert.equal(t1, '00:00');
  assert.equal(t2, '00:07');
  assert.equal(t3, '02:05');
});

// ---------- sleep tests ----------

test('sleep returns a Promise', () => {
  const p = sleep(1);
  assert.ok(p instanceof Promise);
});

// ---------- updateObstacles tests ----------

// Basic helper to set sane defaults for globals used in updateObstacles
function resetBaseEnv() {
  // core subsystems
  global.blackholeAttraction = () => {};
  global.teleportation = () => {};
  global.ShrinkPad = { update: () => {} };

  global.levelObjects = {};
  global.ball = null;

  global.KINEMATIC = 'KINEMATIC';

  // p5 helpers used in some branches
  global.map = (value, start1, stop1, start2, stop2) => {
    const t = (value - start1) / (stop1 - start1);
    return start2 + t * (stop2 - start2);
  };

  global.color = (r, g, b, a) => ({ r, g, b, a });
  global.red = c => c.r;
  global.green = c => c.g;
  global.blue = c => c.b;

  global.radians = deg => (deg * Math.PI) / 180;
  global.sin = Math.sin;
  global.cos = Math.cos;
}

// 1) integration call counts for top-level helpers
test('updateObstacles calls blackholeAttraction, teleportation, and ShrinkPad.update', () => {
  resetBaseEnv();

  let bhCalls = 0;
  let tpCalls = 0;
  let shrinkCalls = 0;

  global.blackholeAttraction = () => { bhCalls++; };
  global.teleportation = () => { tpCalls++; };
  global.ShrinkPad = {
    update: (ball, pads) => { shrinkCalls++; }
  };

  global.ball = {};
  global.levelObjects.shrinkpads = [{}];

  updateObstacles();

  assert.equal(bhCalls, 1);
  assert.equal(tpCalls, 1);
  assert.equal(shrinkCalls, 1);
});

// 2) moving platforms and ball interaction
test('updateObstacles sets KINEMATIC physics, default speed, and moves ball with moving platform', () => {
  resetBaseEnv();

  const platform = {
    physics: null,
    speed: undefined,
    moving: true,
    x: 11,
    maxX: 10,
    minX: 0,
    vel: { x: 0, y: 0 }
  };

  global.levelObjects.platforms = [platform];

  global.ball = {
    x: 0,
    vel: { y: 1 },
    colliding: (obj) => obj === platform
  };

  updateObstacles();

  // physics + default speed
  assert.equal(platform.physics, global.KINEMATIC);
  assert.equal(platform.speed, 2);

  // since x > maxX, platform should move left
  assert.equal(platform.vel.x, -2);
  assert.equal(platform.vel.y, 0);

  // ball should be carried along by platform
  assert.equal(global.ball.x, -2);
});

// 3) disappearing platforms fade logic
test('updateObstacles handles disappearingPlatforms fade-out when touched', () => {
  resetBaseEnv();

  const platform = {
    baseColor: { r: 100, g: 150, b: 200, a: 255 },
    color: null,
    opacity: 255,
    fadeTimer: 0,
    playerTouched: false,
    isDisappearing: false,
    isReappearing: false,
    collider: 'static'
  };

  global.levelObjects.disappearingPlatforms = [platform];

  // ball collides with platform
  global.ball = {
    colliding: (obj) => obj === platform
  };

  updateObstacles();

  // playerTouch + start disappearing
  assert.equal(platform.playerTouched, true);
  assert.equal(platform.isDisappearing, true);
  assert.equal(platform.isReappearing, false);
  assert.equal(platform.fadeTimer, 1);

  // opacity should start decreasing from 255
  assert.ok(platform.opacity < 255);
  assert.ok(platform.color && platform.color.a <= 255);
});

// 4) springs, spikes, enemies, swinging hammers, checkpoints, backtrackTrigger
test('updateObstacles triggers spring bounce, respawn on spikes/enemies, updates hammer and checkpoints', () => {
  resetBaseEnv();

  let respawnCount = 0;
  global.respawn = () => { respawnCount++; };

  let springVolume = null;
  let springPlays = 0;
  global.springSound = {
    isLoaded: () => true,
    setVolume: (v) => { springVolume = v; },
    play: () => { springPlays++; }
  };

  global.globalVolume = 0.5;
  global.godMode = false;

  const spring = {};
  const spike = {};
  const enemy = {
    x: 0,
    y: 0,
    posA: { x: 0, y: 0 },
    posB: { x: 10, y: 0 },
    vel: { x: 1, y: 0 },
    goingToB: true
  };

  const hammer = {
    currentAngle: 0,
    speed: 2,
    direction: 1,
    amplitude: 30,
    length: 10,
    height: 5,
    width: 3,
    scale: 1,
    spikeHeight: 2,
    pivotX: 0,
    pivotY: 0,
    sprite: { x: 0, y: 0, rotation: 0 },
    spikeHitbox: { x: 0, y: 0, width: 0, height: 0, rotation: 0 }
  };

  let checkpointUpdates = 0;
  const checkpoint = { update: () => { checkpointUpdates++; } };

  let backtrackUpdates = 0;
  global.levelObjects.backtrackTrigger = {
    update: () => { backtrackUpdates++; }
  };

  // minimal arrays for the handler
  global.levelObjects.springs = [spring];
  global.levelObjects.spikes = [spike];
  global.levelObjects.enemies = [enemy];
  global.levelObjects.swingingHammers = [hammer];
  global.levelObjects.checkpoints = [checkpoint];

  // dummy arrays for other fields so loops are safe
  global.levelObjects.platforms = [];
  global.levelObjects.laserBlasters = [];
  global.levelObjects.asteriodFields = [];
  global.levelObjects.disappearingPlatforms = [];

  // ball collides with all 3: spring, spike, enemy
  global.ball = {
    vel: { y: 0 },
    colliding: (obj) => obj === spring || obj === spike || obj === enemy
  };

  updateObstacles();

  // Spring: bounce + sound
  assert.equal(global.ball.vel.y, -15);
  assert.equal(springPlays, 1);
  assert.equal(springVolume, global.globalVolume * 0.25);

  // Spike + enemy each call respawn()
  assert.equal(respawnCount, 2);

  // Hammer angle and sprite updated
  assert.notEqual(hammer.currentAngle, 0);
  assert.equal(hammer.sprite.rotation, hammer.currentAngle);
  assert.notEqual(hammer.spikeHitbox.x, 0);
  assert.notEqual(hammer.spikeHitbox.y, 0);

  // Checkpoints and backtrackTrigger updated
  assert.equal(checkpointUpdates, 1);
  assert.equal(backtrackUpdates, 1);
});

