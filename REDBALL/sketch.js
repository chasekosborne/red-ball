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
ball.drag = 0.4;  
ball.y = halfHeight - 200;
ball.diameter = 50;
ball.color = 'red';
let groundA = ground = new Sprite(500, 350, 800, 40);
groundA.physics = STATIC;

let spring = new Sprite(1100,350,200,40)
spring.physics = STATIC;



let ramp  = new Sprite([
  [200, 350],[300, 330],[350, 300],[380, 260],[400, 220],[420, 260],[450, 300],[500, 330],[550, 350],[200, 350]   
]);

ramp.color = 'green';
ramp.physics = STATIC;


ramp.color = 'green';
ramp.physics = STATIC;

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
	if(ball.colliding(spring)){ ball.vel.y = -15; springSound.play() }

	if (kb.pressing('space') && ball.colliding(ground)) {ball.vel.y =  -5; jumpSound.play(); }
	
	
if (kb.pressing('left')) {
  if (ball.vel.x > 0) ball.applyForce(-30);  
  else ball.applyForce(-15);
}

if (kb.pressing('right')) {
  if (ball.vel.x < 0) ball.applyForce(30);
  else ball.applyForce(15);
}



}