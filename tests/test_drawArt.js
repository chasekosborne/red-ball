// tests/test_drawArt.js
const assert = require('assert');

/**
 * What this file tests in drawArt.js:
 * - generateSimplifiedColliders:
 *     - Treats any non-'.' tile as solid.
 *     - Merges adjacent solid tiles horizontally and vertically into a single collider box.
 *
 * - cleanupTileSystem:
 *     - Sets bricksBuilt to false.
 *     - Calls remove() on each layer.buffer in tileLayers.
 *     - Calls remove() on each sprite in simplifiedTileColliders.
 *     - Clears tileLayers and simplifiedTileColliders arrays.
 *
 * - spawnConfetti:
 *     - Replaces the global confetti array with the requested number of Confetto instances.
 *     - Sets confettiActive to true.
 *
 * - updateAndDrawConfetti:
 *     - When confettiActive is false, leaves confetti unchanged.
 *     - When confettiActive is true and all pieces are “dead”:
 *         - Calls update() and display() on each piece.
 *         - Removes all confetti and sets confettiActive to false.
 */

// ----------------- simple sync test helper -----------------
function test(name, fn) {
  try {
    const result = fn();
    if (result && typeof result.then === 'function') {
      throw new Error(`Test "${name}" returned a Promise; async tests are not allowed in this file.`);
    }
    console.log(`✔ ${name}`);
  } catch (err) {
    console.error(`✖ ${name}`);
    console.error(err);
    process.exitCode = 1;
  }
}

// ----------------- p5-ish stubs used by drawArt -----------------

// deterministic random:
//  - random(min, max)
//  - random(array)
global.random = function (a, b) {
  if (Array.isArray(a)) {
    // choose first element for determinism
    return a[0];
  }
  let min, max;
  if (typeof b === 'undefined') {
    min = 0;
    max = a;
  } else {
    min = a;
    max = b;
  }
  return min; // always pick lower bound
};

global.color = function (r = 0, g = 0, b = 0, a = 255) {
  return { r, g, b, a, _tag: 'color' };
};
global.red   = c => c.r;
global.green = c => c.g;
global.blue  = c => c.b;

global.map = function (value, inMin, inMax, outMin, outMax) {
  const t = (value - inMin) / (inMax - inMin);
  return outMin + (outMax - outMin) * t;
};

global.push = () => {};
global.pop = () => {};
global.translate = () => {};
global.rotate = () => {};
global.rectMode = () => {};
global.rect = () => {};
global.noStroke = () => {};
global.fill = () => {};
global.TWO_PI = Math.PI * 2;

// tile graphics buffer stub
global.createGraphics = function (w, h) {
  return {
    width: w,
    height: h,
    noSmooth() {},
    image() {},
    removeCalled: false,
    remove() { this.removeCalled = true; },
  };
};

// These globals are used by cleanupTileSystem; tests will set them up per test.
global.bricksBuilt = false;
global.tileLayers = [];
global.simplifiedTileColliders = [];

// ----------------- import functions from drawArt -----------------
const {
  generateSimplifiedColliders,
  cleanupTileSystem,
  spawnConfetti,
  updateAndDrawConfetti,
  Confetto,
} = require('../src/view/drawArt.js');

// ----------------- Tests -----------------

test('generateSimplifiedColliders merges a solid 2x2 block into one collider', () => {
  const tileData = [
    '....',
    '.xx.',
    '.xx.',
    '....',
  ];
  const startX = 100;
  const startY = 200;
  const tileW = 10;
  const tileH = 20;

  const colliders = generateSimplifiedColliders(tileData, startX, startY, tileW, tileH);

  // Single merged collider for the 2x2 block of 'x'
  assert.strictEqual(colliders.length, 1);

  const c = colliders[0];
  // The solid region starts at col=1,row=1 and extends 2 cols, 2 rows.
  // generateSimplifiedColliders stores collider positions as CENTER coords.
  assert.strictEqual(c.x, startX + 1 * tileW + (2 * tileW) / 2); // 120
  assert.strictEqual(c.y, startY + 1 * tileH + (2 * tileH) / 2); // 240
  assert.strictEqual(c.w, 2 * tileW);
  assert.strictEqual(c.h, 2 * tileH);
});


test('cleanupTileSystem clears bricksBuilt, tileLayers, and simplifiedTileColliders', () => {
  // set up a layer with a removable buffer
  const buffer = {
    removeCalled: false,
    remove() { this.removeCalled = true; },
  };
  const collider = {
    removeCalled: false,
    remove() { this.removeCalled = true; },
  };

  global.bricksBuilt = true;
  global.tileLayers = [{ buffer }];
  global.simplifiedTileColliders = [collider];

  cleanupTileSystem();

  // bricksBuilt reset
  assert.strictEqual(global.bricksBuilt, false);

  // arrays cleared
  assert.strictEqual(global.tileLayers.length, 0);
  assert.strictEqual(global.simplifiedTileColliders.length, 0);

  // remove() called on buffer and collider
  assert.strictEqual(buffer.removeCalled, true);
  assert.strictEqual(collider.removeCalled, true);
});

test('spawnConfetti creates the requested number of Confetto instances and activates confetti', () => {
  global.confetti = [];
  global.confettiActive = false;

  spawnConfetti(50, 75, 5);

  assert.strictEqual(global.confetti.length, 5);
  assert.strictEqual(global.confettiActive, true);

  // each entry should look like a Confetto (at least have update/display/isDead)
  for (const c of global.confetti) {
    assert.strictEqual(typeof c.update, 'function');
    assert.strictEqual(typeof c.display, 'function');
    assert.strictEqual(typeof c.isDead, 'function');
    assert.ok(c instanceof Confetto);
  }
});

test('updateAndDrawConfetti does nothing when confettiActive is false', () => {
  const original = [{ id: 1 }];
  global.confetti = original.slice();
  global.confettiActive = false;

  updateAndDrawConfetti();

  // contents unchanged
  assert.deepStrictEqual(global.confetti, original);
});


test('updateAndDrawConfetti updates, draws, and then clears dead confetti', () => {
  let updates = 0;
  let displays = 0;

  global.confetti = [
    {
      update() { updates++; },
      display() { displays++; },
      isDead() { return true; },
    },
    {
      update() { updates++; },
      display() { displays++; },
      isDead() { return true; },
    },
  ];
  global.confettiActive = true;

  updateAndDrawConfetti();

  // both entries were processed
  assert.strictEqual(updates, 2);
  assert.strictEqual(displays, 2);

  // now everything should be cleared and confetti deactivated
  assert.strictEqual(global.confetti.length, 0);
  assert.strictEqual(global.confettiActive, false);
});
