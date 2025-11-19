function blackholeAttraction() {
    if (!ball) return;

    // Skip ALL black-hole effects in god mode
    if (godMode) return;

    levelObjects.blackhole?.forEach(blackhole => {   //for each blackhole 
        let distanceBlackhole = dist(ball.x, ball.y, blackhole.x, blackhole.y);
        let attractionField = 150;
        if (distanceBlackhole < attractionField) {   
            let distanceBetweenX = blackhole.x - ball.x;   //calculates distance between redball and blackhole
            let distanceBetweenY = blackhole.y - ball.y;   
            forceOnY = (1.2 * distanceBetweenY)/100; //calculates force on ball based on distance between redball and blackhole. Uses a constant and divisor to adjust force strength
            forceOnX = (1.2 * distanceBetweenX)/100;   
            ball.vel.x += forceOnX; //applies force to ball velocity
            ball.vel.y += forceOnY
          if (distanceBlackhole < 60) {  
            respawn();  //if ball is too close to blackhole, it explodes
            if (deathSound && deathSound.isLoaded()) {
              deathSound.setVolume(globalVolume * 0.25);
              deathSound.play();
            }
          }
        }
        
    }); 
}

// Export for Node-based unit tests (no effect in the browser)
if (typeof module !== 'undefined') {
  module.exports = { blackholeAttraction };
}