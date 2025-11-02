// collection of images
let unclaimedFlagImage;
let claimedFlagImage;
let spikeImage;
let laserBlasterImage;
let hammerImage;
let asteriod_sprites;
let teleporterImage;
let blackholeImage;

// Player Vars
let ball;
let ballColor;
let particles = [];
let respawnTimer = 0;
let jumpCount = 0;
let maxJumps = 1;
let lastPlayerVel = [0, 0];
let pausePosition = [0, 0];
let lives = Infinity;
let respawnPosition = [500, 150];

// SFX
let jumpSound;
let deathSound;
let springSound;
let ballSkinImage;
let teleportSound;
let checkSound;

// Music variables
let landMusic;
let odysseyMusic;
let currentMusic;

// Game Vars
let spikes;
let platform;
let spring;
let blackhole;
let gameState = "playing"; // start in menu
let teleporter;
let teleporterActive = true;

// menu globals
let button;
let pauseOverlayEl;
let colorButtonBounds = { x: 20, y: 100, w: 100, h: 30 };
let pauseButtonBounds = { x: 20, y: 140, w: 100, h: 30 };

// level meta data
let presspause = false;
let difficulty = 'normal';
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

// ==== Timer variables ====
let beginTime;
let levelElapsedTime = 0;
let lastFrameTime = 0;
let savedElapsedTime = 0;

// ==== Tile variables ====
let bricksGroup = null;
let bricksBuilt = false;
let brickImage;
let pinkfullGroup = null;
let pinkrightGroup = null;
let pinkleftGroup = null;
let pinkleftImage;
let pinkfullImage;
let pinkrightImage;
let texturedBrickImage;
let texturedBrickGroup = null;