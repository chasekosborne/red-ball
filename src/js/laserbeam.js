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
    }

    update() {
    }
}

// obstacle
class Laserbeam {
    // (x,y) represents the center of the laser rail
    // range represents the total length of the rail
    // dir represents the forward direction of the laser (direction it shoots in)
    constructor(x,y,range,speed,dir,laserTexture,playerRef){
        const offset = (range/2) - (25/2);

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
        this.speed = speed;
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

    update() {
        this.drawBlaster();
        this.moveBlaster();
    }
}