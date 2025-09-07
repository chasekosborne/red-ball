new Q5();

new Canvas();
world.gravity.y = 10;

let jumpSound;

function respawn(){ 
	ball.x = halfWidth - 200;  
    ball.y = halfHeight - 200; 
    ball.vel.x = 0;           
    ball.vel.y = 0;  
};

function preload() {
  jumpSound = loadSound('jump.mp3'); 
  springSound = loadSound('spring.mp3');

}

let ball = new Sprite();
ball.x = halfWidth - 200;
ball.y = halfHeight - 200;
ball.diameter = 50;

let groundA = ground = new Sprite(500, 350, 800, 40);
groundA.physics = STATIC;

let spring = new Sprite(1100,350,200,40)
spring.physics = STATIC;

function update() {
	camera.x += (ball.x - camera.x) * 0.1;
	camera.y += (ball.y - camera.y) * 0.1;

	background('skyblue'); 
	if (ball.y > height + 50) {  
    respawn()        
}
	textAlign(CENTER);
	textSize(20);
	text('space to jump!', halfWidth, halfHeight - 100);
	if(ball.colliding(spring)){ ball.vel.y = -10; springSound.play() }

	if (kb.pressing('space') && ball.colliding(ground)) {ball.vel.y =  -5; jumpSound.play(); }
	if (kb.pressing('left')) { ball.vel.x -= 0.5;        
    if (ball.vel.x < -5) {ball.vel.x = -5;  }
}
	if (kb.pressing('right')) { ball.vel.x += 0.5;        
    if (ball.vel.x > 5) {ball.vel.x = 5;  }
}


}