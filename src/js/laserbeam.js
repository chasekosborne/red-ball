// ENUM for simplicity
const laserForward = Object.freeze({
    LEFT:  "LEFT",
    RIGHT: "RIGHT",
    UP: "UP",
    DOWN: "DOWN",
});
const { LEFT, RIGHT, UP, DOWN } = laserForward;

// bullet-like object
class Laser {
    constructor(x,y,speed,dir,playerRef){
        this.sprite = new Sprite(x, y, 10, 10);
        this.sprite.collider = "none";
        this.sprite.rotationLock = true;
        this.sprite.color = "red";

        this.player = playerRef;
        this.dir = dir;
        this.speed = speed;

        this.maxLifeTime = 60 * 5; // 5 seconds
        this.lifeTime = 0;
        this.alive = true;
    }

    disable_bullet() {
        this.alive = false;
        this.sprite.remove();
    }

    update() {
        if (this.alive) {
            if (this.lifeTime < this.maxLifeTime) {
                this.lifeTime += 1;

                // check for player overlapping before checking against world sprites
                if (this.sprite.overlapping(this.player)) {
                    // console.log("HIT PLAYER");
                    this.disable_bullet();
                    explodeAndRespawn();
                    return;
                }

                // allSprites is a special p5js group that
                // contains all active sprites
                if (this.sprite.overlap(allSprites)) {
                    this.disable_bullet();
                    return;
                }

                if (this.dir === LEFT) {
                    this.sprite.vel.x = -this.speed;
                } else if (this.dir === RIGHT) {
                    this.sprite.vel.x = this.speed;
                } else if (this.dir === UP) {
                    this.sprite.vel.y = -this.speed;
                } else if (this.dir === DOWN) {
                    this.sprite.vel.y = this.speed;
                }
            } else {
                // runs after life-time expires
                this.disable_bullet();
            }
        }
    }
}

// obstacle
class Laserbeam {
    // (x,y) represents the center of the laser rail
    // range represents the total length of the rail
    // dir represents the forward direction of the laser (direction it shoots in)
    constructor(x,y,range,speedData,dir,laserTexture,playerRef){
        const offset = (range/2) - (25/2);
        this.active = true;

        // place the rail anchors and draw the guide-rail
        if (dir === DOWN || dir === UP) {
            this.rail = new Sprite(x, y, range, 10);
            this.leftAnchor  = new Sprite(x - offset, y, 25, 35);
            this.rightAnchor = new Sprite(x + offset, y, 25, 35);

            this.dir = (Math.random() < 0.5) ? LEFT : RIGHT; // direction the laser head moves
        } else if (dir === LEFT || dir === RIGHT) {
            this.rail = new Sprite(x, y, 10, range);
            this.leftAnchor  = new Sprite(x, y - offset, 25, 35);
            this.rightAnchor = new Sprite(x, y + offset, 25, 35);

            this.dir = (Math.random() < 0.5) ? UP : DOWN; // direction the laser head moves
        }

        this.rail.collider = "none";
        this.rail.rotationLock = true;
        this.rail.color = "white";

        this.leftAnchor.collider = "none";
        this.leftAnchor.rotationLock = true;
        this.leftAnchor.color = "grey";

        this.rightAnchor.collider = "none";
        this.rightAnchor.rotationLock = true;
        this.rightAnchor.color = "grey";

        this.sprite = new Sprite(x, y, 25, 25);
        this.sprite.collider = "none";
        this.sprite.rotationLock = true;
        this.sprite.visible = false;

        this.laserBlaster = new Sprite(x, y, 25, 25);
        this.laserBlaster.collider = "none";
        this.laserBlaster.rotationLock = true;
        this.laserBlaster.img = laserTexture;
        this.laserBlaster.scale = 2.5;

        this.forward = dir;
        if (this.forward === LEFT) {
            this.laserBlaster.rotation = 90;
        } else if (this.forward === RIGHT) {
            this.laserBlaster.rotation = 270;
        } else if (this.forward === UP) {
            this.laserBlaster.rotation = 180;
        } else if (this.forward === DOWN) {
            this.laserBlaster.rotation = 0;
        }

        this.player = playerRef;
        this.speed = speedData.speed;
        this.bulletSpeed = speedData.bulletSpeed;

        // reference to all fired bullets
        this.bullets = [];
        this.shootDelay = 60 * 1; // shoot every 1 second
        this.shootCoolDown = 0;
    }

    // takes true or false boolean
    setActive(b) {
        this.active = b;
    }

    // keeps the sprite for the laser in a constant position
    drawBlaster() {
        let x = this.sprite.x;
        let y = this.sprite.y;

        const offset = 10;

        if (this.forward === LEFT) {
            x = this.sprite.x - offset;
        } else if (this.forward === RIGHT) {
            x = this.sprite.x + offset;
        } else if (this.forward === UP) {
            y = this.sprite.y - offset;
        } else if (this.forward === DOWN) {
            y = this.sprite.y + offset;
        }

        this.laserBlaster.x = x;
        this.laserBlaster.y = y;
    }

    // moves the blaster along the rail
    moveBlaster() {
        const laserHeadX = this.sprite.x;
        const laserHeadY = this.sprite.y;

        const leftBound = this.leftAnchor.x + this.leftAnchor.w;
        const rightBound = this.rightAnchor.x - this.rightAnchor.w;
        const upBound = this.leftAnchor.y + this.leftAnchor.h;
        const downBound = this.rightAnchor.y - this.rightAnchor.h;

        // movement of the laser head
        if (this.dir === LEFT) {
            this.sprite.vel.x = -this.speed;
            if (laserHeadX <= leftBound) {
                this.dir = RIGHT;
            }
        } else if (this.dir === RIGHT) {
            this.sprite.vel.x = this.speed;
            if (laserHeadX >= rightBound) {
                this.dir = LEFT;
            }
        } else if (this.dir === UP) {
            this.sprite.vel.y = -this.speed;
            if (laserHeadY <= upBound) {
                this.dir = DOWN;
            }
        } else if (this.dir === DOWN) {
            this.sprite.vel.y = this.speed;
            if (laserHeadY >= downBound) {
                this.dir = UP;
            }
        }
    }

    // remove inactive bullets from reference array
    updateBullets() {
        // make new array of alive bullets
        this.bullets = this.bullets.filter(bullet => bullet.alive);

        // run the update on all live bullets
        for (let i = 0; i < this.bullets.length; ++i) {
            this.bullets[i].update();
        }
    }

    // periodically fires a laser beam
    fireBullet() {
        const x = this.laserBlaster.x;
        const y = this.laserBlaster.y;
        
        const offset = 40;
        
        if (this.forward === LEFT) {
            let bullet = new Laser(x - offset, y, this.bulletSpeed, LEFT, this.player);
            this.bullets.push(bullet);
        } else if (this.forward === RIGHT) {
            const bullet = new Laser(x + offset,  y, this.bulletSpeed, RIGHT, this.player);
            this.bullets.push(bullet);
        } else if (this.forward === UP) {
            const bullet = new Laser(x,y - offset, this.bulletSpeed, UP, this.player);
            this.bullets.push(bullet);
        } else if (this.forward === DOWN) {
            const bullet = new Laser(x, y + offset, this.bulletSpeed, DOWN, this.player);
            this.bullets.push(bullet);
        }
    }

    update() {
        if (!this.active) return;

        this.drawBlaster();
        this.moveBlaster();
        this.updateBullets();

        if (this.shootCoolDown === 0) {
            this.fireBullet();
            this.shootCoolDown = 1;
        } else if (this.shootCoolDown < this.shootDelay) {
            this.shootCoolDown += 1;
            if (this.shootCoolDown >= this.shootDelay) {
                this.shootCoolDown = 0;
            }
        }
    }
}