// collection of images
let unclaimedFlagImage;
let claimedFlagImage;
let spikeImage;
let laserBlasterImage;
let hammerImage;
let asteriod_sprites;

let colorButtonBounds = { x: 20, y: 100, w: 100, h: 30 };
let pauseButtonBounds = { x: 20, y: 140, w: 100, h: 30 };
let ball;
let respawnPosition = [500, 150];
let jumpSound;
let deathSound;
let springSound;
let ballSkinImage;
let teleportSound;

// Music variables
let landMusic;
let odysseyMusic;
let currentMusic;
let spikes;
let platform;
let button;
let ballColor;
let particles = [];
let respawnTimer = 0;
let jumpCount = 0;
let maxJumps = 1;
let spring;
let lastPlayerVel = [0, 0];
let pausePosition = [0, 0];
let gameState = "playing"; // start in menu
let presspause = false;
let teleporter;
let teleporterImage;
let teleporterActive = true;   
let beginTime;
let pauseOverlayEl;
let blackhole;
let blackholeImage;
let difficulty = 'normal';
let lives = Infinity;
let globalVolume = 0.5;

// === Background themes ===
const BG_SKY   = "sky";
const BG_SPACE = "space";

// Active theme (set this per level)
let currentBgTheme = BG_SKY;

// ==== Space assets =====
let bgStars = [];
let bgMeteors = [];
const STAR_COUNT = 280;
const METEOR_RATE = 0.0009;
let spaceSeed = 1337;
// ==== End Space assets =====

let currentLevel = 0; // 0 = dev room
let levels = [];
let levelObjects = {}; // Will store level platforms and stuff