// tests/test_falling_asteriods.js
/*
  This file tests the falling "asteriod" system:

  - randRange() and rotateVector() helper functions
  - Asteriod behavior:
    • spawnImpact: switches to particle mode and hides sprite
    • update: handles collisions with player / pass-through objects
    • explosion phase: marks asteriod as garbage after lifetime
  - AsteriodField behavior:
    • generateBurst creates burstCount Asteriods
    • updateAsteriods removes garbage asteriods
    • freeze() disables field and freezes child asteriods
    • update() respects gameHandler.isPaused() and interval reset
*/
const assert = require('node:assert/strict');

const {
    randRange,
    rotateVector,
    Asteriod,
    AsteriodField
} = require('../src/controller/falling_asteriods.js');

// local test helper (same pattern as other test files)
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

// -------- shared stubs / setup --------

// set up the p5-style globals needed by this module
function setupSpriteAndDrawingGlobals() {
    // p5.js-like color
    global.color = function (r, g, b) {
        return { r, g, b };
    };

    // p5.js-like random for particle velocities (we don't care about exact numbers)
    global.random = function (min, max) {
        if (min === undefined && max === undefined) return 0;
        if (max === undefined) {
            // random(max)
            return 0;
        }
        // random(min, max)
        return min; // deterministic, but good enough
    };

    // no-op drawing functions for particles
    global.fill = function () { };
    global.rect = function () { };

    // very small Sprite stub
    global.Sprite = class {
        constructor(x, y, w, h) {
            this.x = x;
            this.y = y;
            this.w = w;
            this.h = h;
            this.vel = { x: 0, y: 0 };
            this.visible = true;
            this.collider = null;
            this.rotationLock = false;
            this.canPassThrough = false;
            this._removed = false;
        }
        remove() {
            this._removed = true;
        }
        // emulate p5.play overlap: call cb(self, other) for each item in group
        overlap(group, cb) {
            if (!group || !Array.isArray(group)) return;
            for (const other of group) {
                cb(this, other);
            }
        }
    };

    // image pool used by Asteriod constructor
    global.asteriod_sprites = [{ id: 'img0' }, { id: 'img1' }];

    // allSprites group (we'll override per-test as needed)
    global.allSprites = [];

    // explosion callback for player death
    global.explodeAndRespawn = function () { };

    // game handler used by AsteriodField.update()
    global.gameHandler = {
        isPaused: () => false
    };
}

function resetEnvironment() {
    setupSpriteAndDrawingGlobals();
}

// -------- randRange / rotateVector tests --------

test('randRange returns values within inclusive range', () => {
    const oldRandom = Math.random;
    try {
        // force deterministic behavior
        Math.random = () => 0; // always pick min
        const r1 = randRange(5, 10);
        assert.equal(r1, 5);

        Math.random = () => 0.999999; // near max
        const r2 = randRange(5, 10);
        // inclusive range means max can return 10
        assert.equal(r2, 10);
    } finally {
        Math.random = oldRandom;
    }
});

test('rotateVector returns correct vector for 0 degrees', () => {
    const v = rotateVector(0, 5);
    // angle = 0 → x = -sin(0) = 0, y = cos(0) = 1
    assert.ok(Math.abs(v.x - 0) < 1e-9);
    assert.ok(Math.abs(v.y - 5) < 1e-9);
});

// -------- Asteriod tests --------

test('Asteriod.spawnImpact creates particles and hides sprite', () => {
    resetEnvironment();

    const player = { id: 'player' };
    const a = new Asteriod(10, 20, 5, player);

    assert.equal(a.active, true);
    assert.equal(a.particles.length, 0);

    a.spawnImpact();

    assert.equal(a.active, false);
    assert.equal(a.sprite.visible, false);
    assert.equal(a.particles.length, 12);
});

test('Asteriod.update colliding with player triggers impact and explodeAndRespawn', () => {
    resetEnvironment();

    let exploded = false;
    global.explodeAndRespawn = () => { exploded = true; };

    const player = { id: 'player' };
    const a = new Asteriod(0, 0, 5, player);

    // collision group contains the same player ref
    global.allSprites = [player];

    // make sure we are in active (flying) mode
    a.active = true;

    a.update();

    assert.equal(a.active, false);           // switched to particle mode
    assert.equal(a.sprite.visible, false);   // hidden
    assert.equal(exploded, true);           // player "died"
});

test('Asteriod.update ignores collisions with canPassThrough objects', () => {
    resetEnvironment();

    let exploded = false;
    global.explodeAndRespawn = () => { exploded = true; };

    const player = { id: 'player' };
    const a = new Asteriod(0, 0, 5, player);

    // other asteriod, should be pass-through
    const otherAsteriod = { canPassThrough: true };
    global.allSprites = [otherAsteriod];

    a.active = true;

    a.update();

    // Should still be active, no particles spawned, no explosion
    assert.equal(a.active, true);
    assert.equal(a.particles.length, 0);
    assert.equal(exploded, false);
});

test('Asteriod in explosion phase becomes garbage after lifetime', () => {
    resetEnvironment();

    const player = { id: 'player' };
    const a = new Asteriod(0, 0, 5, player);

    a.spawnImpact();   // active -> false, particles created
    a.t = 180;         // simulate timer at threshold

    a.update();

    // sprite removed and marked as garbage
    assert.equal(a.sprite._removed, true);
    assert.equal(a.garbage, true);
});

// -------- AsteriodField tests --------

test('AsteriodField.generateBurst creates burstCount Asteriods', () => {
    resetEnvironment();

    const player = { id: 'player' };
    const field = new AsteriodField(100, 50, 40, 7, 3, 2, player);

    assert.equal(field.asteriods.length, 0);

    field.generateBurst();

    assert.equal(field.asteriods.length, 3);
    for (const a of field.asteriods) {
        assert.ok(a instanceof Asteriod);
        assert.equal(a.player, player);
        assert.equal(a.speed, 7);
    }
});

test('AsteriodField.updateAsteriods removes garbage asteriods', () => {
    resetEnvironment();

    const player = { id: 'player' };
    const field = new AsteriodField(0, 0, 10, 5, 1, 1, player);

    const a1 = new Asteriod(0, 0, 5, player);
    const a2 = new Asteriod(0, 0, 5, player);
    a1.garbage = false;
    a2.garbage = true;

    field.asteriods = [a1, a2];

    field.updateAsteriods();

    assert.equal(field.asteriods.length, 1);
    assert.strictEqual(field.asteriods[0], a1);
});

test('AsteriodField.freeze disables field and freezes all asteriods', () => {
    resetEnvironment();

    const player = { id: 'player' };
    const field = new AsteriodField(0, 0, 10, 5, 1, 1, player);

    const frozenFlags = [];
    field.asteriods = [
        { freeze: () => frozenFlags.push(0) },
        { freeze: () => frozenFlags.push(1) }
    ];

    field.freeze();

    assert.equal(field.enabled, false);
    assert.deepEqual(frozenFlags.sort(), [0, 1]);
});

test('AsteriodField.update respects gameHandler.isPaused and does not spawn when paused', () => {
    resetEnvironment();

    const player = { id: 'player' };
    const field = new AsteriodField(0, 0, 10, 5, 2, 1, player);

    // pause the game
    global.gameHandler.isPaused = () => true;

    field.update();

    // disabled and no asteriods spawned
    assert.equal(field.enabled, false);
    assert.equal(field.asteriods.length, 0);
});

test('AsteriodField.update resets timer when interval is reached', () => {
    resetEnvironment();

    const player = { id: 'player' };
    // timeInterval = 1 → interval = 60
    const field = new AsteriodField(0, 0, 10, 5, 1, 1, player);

    // not paused
    global.gameHandler.isPaused = () => false;

    // set t to interval so we hit the "reset" branch
    field.t = field.interval;

    field.update();

    // timer reset to 0, but no new burst generated in this frame
    assert.equal(field.t, 0);
});


