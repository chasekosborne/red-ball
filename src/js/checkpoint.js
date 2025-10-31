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

    // check if the player has collided into the checkpoint and change states
    update() {
        if (!this.claimed && this.sprite.overlapping(this.player)) {
            console.log("CLAIMED!")

            //Checkpoint sound
            if(checkSound && checkSound.isLoaded()) {
                checkSound.setVolume(globalVolume);
                checkSound.play();
            }
            // affordance of claimage
            this.sprite.img = claimedFlagImage;

            this.claimed = true;

            // set the player respawn point just a bit above the flag sprite
            let x = this.sprite.x;
            let y = this.sprite.y - 10;
            respawnPosition = [x,y];
            console.log(respawnPosition);
        }
    }
}