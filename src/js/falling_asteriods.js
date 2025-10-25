// global function
const randRange = (min,max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

function rotateVector (thetaDeg, scalar) {
    // convert to radians
    const thetaRad = thetaDeg * (Math.PI / 180);
    // calculate new vector using trig
    const x = -Math.sin(thetaRad);
    const y =  Math.cos(thetaRad);

    // produce normalized vector (magnitude is 1)
    // and multiply it with a scalar to show speed
    return { x: (x * scalar), y: (y * scalar) };
}

class Asteriod {
    constructor(x,y,speed,playerRef) {
        this.player = playerRef;
        this.active = true;
        this.garbage = false;
        this.t = 0;
        this.speed = speed;

        this.particles = [];
        this.particleColor = color(166, 151, 109); // RGB

        // randomly generate (x,y) velocity asteriod uses
        const angle = randRange(-65,65);
        const newDir = rotateVector(angle, this.speed);

        this.dir = { x: newDir.x, y: newDir.y };

        this.sprite = new Sprite(x, y, 50, 50);
        this.sprite.collider = "none";
        this.sprite.rotationLock = true;
        this.sprite.canPassThrough = true; // special attribute used to avoid asteriods colliding with each other

        // asteriod_sprites is a global var within sketch.js
        const i = Math.floor(Math.random() * (asteriod_sprites.length - 1));
        this.sprite.img = asteriod_sprites[i];
    }
    dtor() {
        console.log("Running asteriod_field dtor");

        if (this.sprite)
            this.sprite.remove();

        for (let i = 0; i > this.particles.length; ++i) {
            this.particles.pop();
        }
    }

    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            let p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.2;
            p.life--;

            fill(this.particleColor);
            rect(p.x, p.y, 6, 6);

            if (p.life <= 0) this.particles.splice(i, 1);
        }
    }

    spawnImpact() {
        this.sprite.visible = false;

        // spawn particle system
        for (let i = 0; i < 12; i++) {
            this.particles.push({
                x: this.sprite.x,
                y: this.sprite.y,
                vx: random(-4, 4),
                vy: random(-6, -2),
                life: 40
            });
        }

        this.active = false;
    }

    update() {
        if (this.active) {
            // travel with vel
            this.sprite.vel.x = this.dir.x;
            this.sprite.vel.y = this.dir.y;

            // allSprites is a special p5js group that
            // contains all active sprites
            this.sprite.overlap(allSprites, (self, other) => {
                // do not run deletion logic (colliding with another asteriod)
                if (other.canPassThrough && other.canPassThrough === true) {
                    return;
                }

                if (other === this.player) {
                    this.spawnImpact();
                    explodeAndRespawn(); // player dies
                    return;
                }

                // landed on the ground
                this.spawnImpact();
                return;
            });

        } else {
            this.updateParticles();

            if (this.t < 180) {
                ++this.t;
            } else {
                this.sprite.remove();
                this.garbage = true;
            }
        }
    }
};

class AsteriodField {
    constructor(x,y,range,fallSpeed,burstCount,timeInterval,playerRef) {
        this.player = playerRef;

        // number of asteriods that spawn in each burst
        this.burstCount = burstCount;
        
        // spawn-range area
        /*
            +-----------------------------------+
            |            Asteriod               |
            |   Trajectory-Impact Visualizer    |
            +-----------------------------------+
            |[---------------RANGE-------------]|
            |[===O=======O=====O=======O==O====]|  O --> Asteriod
            |     \     /       \     /  /      |
            |      \   /         \   /  /       |
            |       \ /           \ /  /        |
            +--------X-------------X--X---------+  X --> Impact Marker
        */
        this.range = range;

        this.t = 0;
        this.interval = timeInterval * 60;
        
        this.fallSpeed = fallSpeed;
        
        this.x = x;
        this.y = y;

        this.asteriods = [];
    }
    dtor() {
        // destroy asteriods
        for (let i = 0; i > this.asteriods.length; ++i) {
            let asteriod = this.asteriods.pop();
            if (asteriod) asteriod.dtor();
        }
    }

    updateAsteriods() {
        for (let i = this.asteriods.length - 1; i >= 0; i--) {
            let asteriod = this.asteriods[i];
            
            asteriod.update();

            // remove garbage asteriod from collection
            if (asteriod.garbage === true) this.asteriods.splice(i, 1);
        }
    }

    generateBurst() {
        for (let i = 0; i < this.burstCount; ++i) {
            // generate random x position
            const x = this.x + randRange(-this.range / 2, this.range / 2);
            const y = this.y;

            let asteriod = new Asteriod(x,y,this.fallSpeed,this.player);
            this.asteriods.push(asteriod);
        }
    }

    update() {
        this.updateAsteriods();

        if (this.t === 0) {
            // spawn a burst
            this.generateBurst();
        } else if (this.t >= this.interval) {
            // ready next burst
            this.t = 0;
            return;
        }

        // waiting
        ++this.t;
    }
};