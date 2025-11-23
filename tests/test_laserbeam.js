// tests/test_laserbeam.js
/*
  Tests laserbeam.js behavior:

  - Laser bullets:
    • disable_bullet() marks bullet dead and removes sprite
    • freeze() zeroes velocity
    • update():
      - hits player → calls respawn() and disables bullet
      - hits world sprites → disables bullet
      - moves in correct direction when no collisions
      - dies after exceeding maxLifeTime

  - Laserbeam:
    • drawBlaster() keeps blaster offset from head based on forward dir
    • moveBlaster() moves along rail and flips direction at anchors
    • updateBullets() filters dead bullets and calls update() on live ones
    • fireBullet() spawns Laser at correct offset with correct dir/speed
    • freeze() stops head and freezes all bullets
    • update():
      - does nothing when inactive
      - calls draw/move/updateBullets
      - fires bullets when shootCoolDown hits 0
      - advances and wraps shootCoolDown up to shootDelay
*/
const assert = require('node:assert/strict');

const {
    laserForward,
    LEFT,
    RIGHT,
    UP,
    DOWN,
    Laser,
    Laserbeam
} = require('../src/controller/laserbeam.js');

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

// ---------- shared stubs / setup ----------

// Sprite stub used by both Laser and Laserbeam
class StubSprite {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.vel = { x: 0, y: 0 };
        this.visible = true;
        this.collider = null;
        this.rotationLock = false;
        this.color = null;
        this.img = null;
        this.scale = 1;
        this.rotation = 0;
        this._removed = false;
    }
    remove() {
        this._removed = true;
    }
    // default: no overlaps; individual tests can override per-instance
    overlapping(target) {
        return false;
    }
    overlap(group) {
        return false;
    }
}

function resetGlobals() {
    global.Sprite = StubSprite;
    global.allSprites = [];
    global.respawn = function () { /* stubbed per test */ };
}

// ---------- Laser tests ----------

test('Laser.disable_bullet marks bullet dead and removes sprite', () => {
    resetGlobals();

    const player = {};
    const laser = new Laser(0, 0, 5, LEFT, player);

    assert.equal(laser.alive, true);
    assert.equal(laser.sprite._removed, false);

    laser.disable_bullet();

    assert.equal(laser.alive, false);
    assert.equal(laser.sprite._removed, true);
});

test('Laser.freeze sets velocity to zero', () => {
    resetGlobals();

    const player = {};
    const laser = new Laser(0, 0, 5, RIGHT, player);

    laser.sprite.vel.x = 3;
    laser.sprite.vel.y = -2;

    laser.freeze();

    assert.equal(laser.sprite.vel.x, 0);
    assert.equal(laser.sprite.vel.y, 0);
});

test('Laser.update hitting player calls respawn and disables bullet', () => {
    resetGlobals();

    let respawnCalled = false;
    global.respawn = () => { respawnCalled = true; };

    const player = {};
    const laser = new Laser(0, 0, 5, LEFT, player);

    // override overlapping to always say "hit player"
    laser.sprite.overlapping = () => true;
    laser.sprite.overlap = () => false;

    laser.lifeTime = 0;
    laser.alive = true;

    laser.update();

    assert.equal(respawnCalled, true);
    assert.equal(laser.alive, false);
    assert.equal(laser.sprite._removed, true);
});

test('Laser.update hitting world sprites disables bullet without respawn', () => {
    resetGlobals();

    let respawnCalled = false;
    global.respawn = () => { respawnCalled = true; };

    const player = {};
    const laser = new Laser(0, 0, 5, RIGHT, player);

    // no player overlap
    laser.sprite.overlapping = () => false;
    // world overlap
    global.allSprites = [{}];
    laser.sprite.overlap = () => true;

    laser.update();

    assert.equal(respawnCalled, false);
    assert.equal(laser.alive, false);
    assert.equal(laser.sprite._removed, true);
});

test('Laser.update moves left when dir is LEFT and no collisions', () => {
    resetGlobals();

    global.respawn = () => { };

    const player = {};
    const laser = new Laser(0, 0, 5, LEFT, player);

    laser.sprite.overlapping = () => false;
    laser.sprite.overlap = () => false;

    laser.update();

    assert.equal(laser.alive, true);
    assert.equal(laser.sprite.vel.x, -5);
    assert.equal(laser.sprite.vel.y, 0);
    assert.equal(laser.lifeTime, 1);
});

test('Laser.update moves up when dir is UP and no collisions', () => {
    resetGlobals();

    global.respawn = () => { };

    const player = {};
    const laser = new Laser(0, 0, 7, UP, player);

    laser.sprite.overlapping = () => false;
    laser.sprite.overlap = () => false;

    laser.update();

    assert.equal(laser.alive, true);
    assert.equal(laser.sprite.vel.x, 0);
    assert.equal(laser.sprite.vel.y, -7);
    assert.equal(laser.lifeTime, 1);
});

test('Laser.update disables bullet after maxLifeTime is exceeded', () => {
    resetGlobals();

    const player = {};
    const laser = new Laser(0, 0, 5, DOWN, player);

    laser.lifeTime = laser.maxLifeTime; // already at limit
    laser.sprite.overlapping = () => false;
    laser.sprite.overlap = () => false;

    laser.update();

    assert.equal(laser.alive, false);
    assert.equal(laser.sprite._removed, true);
});

// ---------- Laserbeam tests ----------

test('Laserbeam.drawBlaster keeps blaster offset from head based on forward dir', () => {
    resetGlobals();

    const player = {};
    const speedData = { speed: 1, bulletSpeed: 5 };
    const tex = {};

    const beamLeft = new Laserbeam(100, 50, 80, speedData, LEFT, tex, player);
    beamLeft.sprite.x = 100;
    beamLeft.sprite.y = 50;
    beamLeft.drawBlaster();
    assert.equal(beamLeft.laserBlaster.x, 90);  // 100 - 10
    assert.equal(beamLeft.laserBlaster.y, 50);

    const beamDown = new Laserbeam(200, 80, 80, speedData, DOWN, tex, player);
    beamDown.sprite.x = 200;
    beamDown.sprite.y = 80;
    beamDown.drawBlaster();
    assert.equal(beamDown.laserBlaster.x, 200);
    assert.equal(beamDown.laserBlaster.y, 90);  // 80 + 10
});

test('Laserbeam.moveBlaster moves left and right and flips direction at bounds', () => {
    resetGlobals();

    const player = {};
    const speedData = { speed: 2, bulletSpeed: 5 };
    const tex = {};

    // forward DOWN → vertical rail, horizontal head movement (LEFT/RIGHT)
    const beam = new Laserbeam(100, 50, 80, speedData, DOWN, tex, player);

    // force deterministic dir and bounds
    beam.dir = LEFT;
    const leftBound = beam.leftAnchor.x + beam.leftAnchor.w;
    const rightBound = beam.rightAnchor.x - beam.rightAnchor.w;

    // case 1: inside bounds, still moving LEFT
    beam.sprite.x = leftBound + 1;
    beam.moveBlaster();
    assert.equal(beam.sprite.vel.x, -speedData.speed);
    assert.equal(beam.dir, LEFT);

    // case 2: at/left of bound → flip to RIGHT
    beam.sprite.x = leftBound - 1;
    beam.moveBlaster();
    assert.equal(beam.sprite.vel.x, -speedData.speed); // velocity set before flip
    assert.equal(beam.dir, RIGHT);
});

test('Laserbeam.updateBullets filters dead bullets and updates live ones', () => {
    resetGlobals();

    const player = {};
    const speedData = { speed: 1, bulletSpeed: 5 };
    const tex = {};

    const beam = new Laserbeam(0, 0, 40, speedData, RIGHT, tex, player);

    let updated = [];
    const liveBullet = {
        alive: true,
        update: () => updated.push('live')
    };
    const deadBullet = {
        alive: false,
        update: () => updated.push('dead')
    };

    beam.bullets = [liveBullet, deadBullet];

    beam.updateBullets();

    assert.deepEqual(beam.bullets, [liveBullet]);
    assert.deepEqual(updated, ['live']);
});

test('Laserbeam.fireBullet creates Laser at correct offset and direction', () => {
    resetGlobals();

    const player = {};
    const speedData = { speed: 1, bulletSpeed: 7 };
    const tex = {};

    const beam = new Laserbeam(100, 50, 40, speedData, LEFT, tex, player);

    // place blaster and fire
    beam.laserBlaster.x = 100;
    beam.laserBlaster.y = 50;
    beam.forward = LEFT;
    beam.bullets = [];

    beam.fireBullet();

    assert.equal(beam.bullets.length, 1);
    const bullet = beam.bullets[0];
    assert.ok(bullet instanceof Laser);
    assert.equal(bullet.speed, 7);
    assert.equal(bullet.dir, LEFT);
    assert.equal(bullet.sprite.x, 60); // 100 - 40
    assert.equal(bullet.sprite.y, 50);
});

test('Laserbeam.freeze stops head and freezes all bullets', () => {
    resetGlobals();

    const player = {};
    const speedData = { speed: 3, bulletSpeed: 5 };
    const tex = {};

    const beam = new Laserbeam(0, 0, 40, speedData, RIGHT, tex, player);

    beam.sprite.vel.x = 3;
    beam.sprite.vel.y = -1;

    let frozen = [];
    beam.bullets = [
        { freeze: () => frozen.push(0) },
        { freeze: () => frozen.push(1) }
    ];

    beam.freeze();

    assert.equal(beam.sprite.vel.x, 0);
    assert.equal(beam.sprite.vel.y, 0);
    frozen.sort();
    assert.deepEqual(frozen, [0, 1]);
});

test('Laserbeam.update does nothing when inactive', () => {
    resetGlobals();

    const player = {};
    const speedData = { speed: 1, bulletSpeed: 5 };
    const tex = {};

    const beam = new Laserbeam(0, 0, 40, speedData, RIGHT, tex, player);

    let drawCalled = 0;
    let moveCalled = 0;
    let bulletsCalled = 0;
    let shots = 0;

    beam.active = false;
    beam.drawBlaster = () => { drawCalled++; };
    beam.moveBlaster = () => { moveCalled++; };
    beam.updateBullets = () => { bulletsCalled++; };
    beam.fireBullet = () => { shots++; };

    beam.update();

    assert.equal(drawCalled, 0);
    assert.equal(moveCalled, 0);
    assert.equal(bulletsCalled, 0);
    assert.equal(shots, 0);
});

test('Laserbeam.update fires bullet when shootCoolDown is 0 and advances cooldown', () => {
    resetGlobals();

    const player = {};
    const speedData = { speed: 1, bulletSpeed: 5 };
    const tex = {};

    const beam = new Laserbeam(0, 0, 40, speedData, RIGHT, tex, player);

    let shots = 0;
    beam.drawBlaster = () => { };
    beam.moveBlaster = () => { };
    beam.updateBullets = () => { };
    beam.fireBullet = () => { shots++; };

    beam.active = true;
    beam.shootCoolDown = 0;

    beam.update();

    assert.equal(shots, 1);
    assert.equal(beam.shootCoolDown, 1);
});

test('Laserbeam.update wraps shootCoolDown back to 0 after reaching shootDelay', () => {
    resetGlobals();

    const player = {};
    const speedData = { speed: 1, bulletSpeed: 5 };
    const tex = {};

    const beam = new Laserbeam(0, 0, 40, speedData, RIGHT, tex, player);

    beam.drawBlaster = () => { };
    beam.moveBlaster = () => { };
    beam.updateBullets = () => { };
    beam.fireBullet = () => { }; // we only care about cooldown here

    beam.active = true;
    // simulate we already fired once and are counting up
    beam.shootCoolDown = 1;

    // run updates until we wrap
    while (beam.shootCoolDown !== 0) {
        beam.update();
    }

    assert.equal(beam.shootCoolDown, 0);
});

