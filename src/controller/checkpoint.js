class CheckPoint {
    // draws the flag at a given position
    constructor(x,y,playerRef){
        // sprite is the same size as the player
        this.sprite = new Sprite(x, y, 50, 50);
        
        this.sprite.collider = "none";
        this.sprite.rotationLock = true;

        this.player = playerRef;

        this.claimed = false;

        // draw image on the sprite
        this.sprite.img = unclaimedFlagImage;
    }
    dtor() {
        console.log("Running checkpoint dtor");

        if (this.sprite)
            this.sprite.remove();
    }

    reset () {
        this.claimed = false;
        this.allCheckpoints = null;
        this.sprite.img = unclaimedFlagImage;
    }

    setAllCheckpoints(allCheckpoints) {
        this.allCheckpoints = allCheckpoints;
    }
    
    // check if the player has collided into the checkpoint and change states
    update() {
        if (!this.claimed && this.sprite.overlapping(this.player)) {
            //console.log("CLAIMED!");
            if (this.allCheckpoints) {
                this.allCheckpoints.forEach(other => {
                    if (other !== this && other.claimed) {
                        other.reset();
                    }
                });
            }
            
            //Checkpoint sound
            if(checkSound && checkSound.isLoaded()) {
                checkSound.play(0, 1, globalVolume * 0.3, 0.5, 0.7);
            }
            // affordance of claimage
            this.sprite.img = claimedFlagImage;

            this.claimed = true;

            // set the player respawn point just a bit above the flag sprite
            let x = this.sprite.x;
            let y = this.sprite.y - 10;
            respawnPosition = [x,y];
            //console.log(respawnPosition);
        }
    }
}

class BacktrackTrigger {
    constructor(x,y,w,h,playerRef) {
        this.sprite = new Sprite(x, y, w, h);

        this.sprite.visible = false;
        this.sprite.collider = "none";
        this.sprite.rotationLock = true;

        this.player = playerRef;
        this.checkpointsReset = false;
        this.checkpoints = [];
    }
    dtor() {
        console.log("Running BacktrackTrigger dtor");

        if (this.sprite)
            this.sprite.remove();
    }

    setCheckpoints(checkpoints) {
        this.checkpoints = checkpoints;
    }

    resetCheckpoints() {
        this.checkpoints?.forEach(checkpoint => {
            checkpoint.reset();
        });
    }

    // check if the player has collided into the checkpoint and change states
    update() {
        if (!this.checkpointsReset && this.sprite.overlapping(this.player)) {
            this.resetCheckpoints();
            this.checkpointsReset = true;
        }
    }
}

// Export for Node-based unit tests (no effect in the browser)
if (typeof module !== 'undefined') {
  module.exports = { CheckPoint, BacktrackTrigger };
}
