const assert = require('assert');

/**
 * What this file tests in musicManager.js:
 * - playLevelMusic:
 *     - Stops any existing currentMusic.
 *     - For level.music 'land' or 'odyssey' with isLoaded() true:
 *         - Sets currentMusic to the correct track.
 *         - Sets volume to musicVolume and calls loop().
 *     - For unknown or not-loaded music:
 *         - Stops currentMusic but does not switch to a new track.
 *
 * - pauseMusic:
 *     - Pauses currentMusic when it is playing.
 *     - Also pauses redballMusic when it is playing.
 *
 * - resumeMusic:
 *     - If currentMusic exists, sets volume and calls play().
 *     - Resumes redballMusic only when the menu element is visible.
 *
 * - playMenuMusic:
 *     - Stops current level music if present.
 *     - Starts looping redballMusic at musicVolume when loaded.
 *
 * - updateMusicVolume:
 *     - Calls setVolume(musicVolume) on currentMusic and redballMusic if they exist.
 *
 * - stopMenuMusic:
 *     - Calls stop() on redballMusic only when it is playing.
 */

// ------------- simple sync test helper (no async tests) -------------
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

// ------------- shared mocks / globals -------------

function makeMockSound() {
  return {
    _loaded: true,
    _playing: false,
    _volume: 0,
    _looped: false,
    _paused: false,
    _stopped: false,
    isLoaded() { return this._loaded; },
    isPlaying() { return this._playing; },
    play() { this._playing = true; },
    loop() { this._playing = true; this._looped = true; },
    pause() { this._playing = false; this._paused = true; },
    stop() { this._playing = false; this._stopped = true; },
    setVolume(v) { this._volume = v; },
  };
}

// base env reset per test
function resetEnv() {
  global.currentMusic = null;
  global.landMusic = null;
  global.odysseyMusic = null;
  global.redballMusic = null;
  global.musicVolume = 0.5;

  // minimal DOM/window stubs for resumeMusic()
  global.document = {
    _menuEl: { style: { display: 'block' } },
    getElementById(id) {
      if (id === 'menu') return this._menuEl;
      return null;
    },
  };
  global.window = {
    getComputedStyle(el) {
      return { display: el.style.display };
    },
  };
}

// require after defining globals so file can see them if needed
resetEnv();
const {
  playLevelMusic,
  pauseMusic,
  resumeMusic,
  playMenuMusic,
  updateMusicVolume,
  stopMenuMusic,
} = require('../src/view/musicManager.js');

// ------------- Tests -------------

test('playLevelMusic stops existing music and starts land track', () => {
  resetEnv();

  const oldMusic = makeMockSound();
  oldMusic._playing = true;

  global.currentMusic = oldMusic;
  global.landMusic = makeMockSound();
  global.landMusic._loaded = true;
  global.odysseyMusic = makeMockSound();
  global.musicVolume = 0.7;

  const level = { name: 'Level 1', music: 'land' };

  playLevelMusic(level);

  // previous track stopped
  assert.strictEqual(oldMusic._stopped, true);

  // currentMusic switched to landMusic
  assert.strictEqual(global.currentMusic, global.landMusic);
  assert.strictEqual(global.landMusic._volume, 0.7);
  assert.strictEqual(global.landMusic._looped, true);
});

test('playLevelMusic starts odyssey track when requested', () => {
  resetEnv();

  global.currentMusic = null;
  global.landMusic = makeMockSound();
  global.landMusic._loaded = true;
  global.odysseyMusic = makeMockSound();
  global.odysseyMusic._loaded = true;
  global.musicVolume = 0.4;

  const level = { name: 'Level 2', music: 'odyssey' };

  playLevelMusic(level);

  assert.strictEqual(global.currentMusic, global.odysseyMusic);
  assert.strictEqual(global.odysseyMusic._volume, 0.4);
  assert.strictEqual(global.odysseyMusic._looped, true);
});

test('playLevelMusic leaves currentMusic as stopped old track when music is unknown or not loaded', () => {
  resetEnv();

  const oldMusic = makeMockSound();
  oldMusic._playing = true;
  global.currentMusic = oldMusic;

  // land/odyssey exist but not loaded
  global.landMusic = makeMockSound();
  global.landMusic._loaded = false;
  global.odysseyMusic = makeMockSound();
  global.odysseyMusic._loaded = false;

  const level = { name: 'Level X', music: 'unknown' };

  playLevelMusic(level);

  // old track stopped, but no new track selected
  assert.strictEqual(oldMusic._stopped, true);
  assert.strictEqual(global.currentMusic, oldMusic);
});

test('pauseMusic pauses currentMusic and redballMusic when they are playing', () => {
  resetEnv();

  global.currentMusic = makeMockSound();
  global.currentMusic._playing = true;
  global.redballMusic = makeMockSound();
  global.redballMusic._playing = true;

  pauseMusic();

  assert.strictEqual(global.currentMusic._playing, false);
  assert.strictEqual(global.currentMusic._paused, true);

  assert.strictEqual(global.redballMusic._playing, false);
  assert.strictEqual(global.redballMusic._paused, true);
});

test('resumeMusic resumes currentMusic and menu music only when menu is visible', () => {
  resetEnv();

  global.currentMusic = makeMockSound();
  global.redballMusic = makeMockSound();
  global.musicVolume = 0.9;

  // menu visible
  document._menuEl.style.display = 'block';

  resumeMusic();

  // current level music resumed
  assert.strictEqual(global.currentMusic._playing, true);
  assert.strictEqual(global.currentMusic._volume, 0.9);

  // menu music resumed because menu is visible
  assert.strictEqual(global.redballMusic._playing, true);
  assert.strictEqual(global.redballMusic._volume, 0.9);

  // now hide menu and call again; menu music should not be restarted if stopped
  global.redballMusic._playing = false;
  document._menuEl.style.display = 'none';

  resumeMusic();

  // currentMusic still plays and volume set
  assert.strictEqual(global.currentMusic._playing, true);
  assert.strictEqual(global.currentMusic._volume, 0.9);

  // redballMusic should remain not playing because menu is hidden
  assert.strictEqual(global.redballMusic._playing, false);
});

test('playMenuMusic stops current level music and loops redballMusic when loaded', () => {
  resetEnv();

  const oldMusic = makeMockSound();
  oldMusic._playing = true;
  global.currentMusic = oldMusic;

  global.redballMusic = makeMockSound();
  global.redballMusic._loaded = true;
  global.musicVolume = 0.3;

  playMenuMusic();

  // level music stopped
  assert.strictEqual(oldMusic._stopped, true);

  // menu music started
  assert.strictEqual(global.redballMusic._playing, true);
  assert.strictEqual(global.redballMusic._looped, true);
  assert.strictEqual(global.redballMusic._volume, 0.3);
});

test('updateMusicVolume sets volume on currentMusic and redballMusic', () => {
  resetEnv();

  global.currentMusic = makeMockSound();
  global.redballMusic = makeMockSound();
  global.musicVolume = 0.25;

  updateMusicVolume();

  assert.strictEqual(global.currentMusic._volume, 0.25);
  assert.strictEqual(global.redballMusic._volume, 0.25);
});

test('stopMenuMusic stops redballMusic only when it is playing', () => {
  resetEnv();

  global.redballMusic = makeMockSound();
  global.redballMusic._playing = true;

  stopMenuMusic();

  assert.strictEqual(global.redballMusic._stopped, true);
  assert.strictEqual(global.redballMusic._playing, false);

  // calling again when not playing should not change stopped flag
  global.redballMusic._stopped = false;
  global.redballMusic._playing = false;

  stopMenuMusic();

  assert.strictEqual(global.redballMusic._stopped, false);
});
