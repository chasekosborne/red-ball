function teleportation() {
    if (!ball) return;

    for (let teleporterNumber = 0; teleporterNumber < levelObjects.teleporter.length; teleporterNumber+=2) {   
      let teleport1 = levelObjects.teleporter[teleporterNumber];
      let teleport2 = levelObjects.teleporter[teleporterNumber + 1];

      if (!teleport1 || !teleport2) continue;  //skip if teleporter pair is incomplete

      if (dist(ball.x, ball.y, teleport1.x, teleport1.y) < 45 && teleporterActive) {
          ball.x = teleport2.x;   //teleport to paired teleporter
          ball.y = teleport2.y;
          
          if(teleportSound?.isLoaded()){
            teleportSound.setVolume(globalVolume * 0.25);  //play sound effect
            teleportSound.play();
          }

          teleporterActive = false;  //deactivate teleporter
          beginTime = millis();      //start delay timer
          return;
      }

      if(dist(ball.x, ball.y, teleport2.x, teleport2.y) < 45 && teleporterActive) {
          ball.x = teleport1.x;
          ball.y = teleport1.y;
          
          if(teleportSound?.isLoaded()){
            teleportSound.setVolume(globalVolume * 0.25);
            teleportSound.play();
          }
          teleporterActive = false;
          beginTime = millis();
          return;
      }
    }
    if(millis() - beginTime >=3000){  //after a 3 second delay, teleporter can be used again
            teleporterActive = true;     //activates teleporter
        }

    }


// Only for Node-based unit tests
if (typeof module !== 'undefined') {
  module.exports = {
    teleportation
  };
}