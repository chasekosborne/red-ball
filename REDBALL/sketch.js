new Q5();

new Canvas();
world.gravity.y = 10;
let ball;
let jumpSound;
let spikes; 
let platform;


let spring;
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
	function setup() {
	platform = new Sprite(600, 250, 120, 20);
  platform.color = 'orange';
  platform.physics = KINEMATIC;  
  platform.speed = 2;        
  platform.direction = 1; 

ball = new Sprite();
ball.x = halfWidth - 200;
ball.drag = 0.4;  
ball.textSize = 40;
ball.text = ":)";
ball.y = halfHeight - 200;
ball.diameter = 50;
ball.color = 'red';
let groundA = ground = new Sprite(500, 350, 800, 40);
groundA.physics = STATIC;

spring = new Sprite(1100,350,200,40)
spring.physics = STATIC;

spikes = new Sprite([
  [780 + 0, 290 + 40],  
  [780 + 20, 290 + 0],  
  [780 + 40, 290 + 40],  
  [780 + 0, 290 + 40]    
]); 

spikes.color = 'red';
spikes.physics = STATIC;



}


function update() {
	camera.x += (ball.x - camera.x) * 0.1;
	camera.y += (ball.y - camera.y) * 0.1;

	background('skyblue'); 
	if (ball.y > height + 50) {  
    respawn();      
}
	textAlign(CENTER);
	textSize(20);
	text('space to jump!', halfWidth, halfHeight - 100);
	if(ball.colliding(spring)){ ball.vel.y = -15; springSound.play() }

	if (kb.pressing('space') && (ball.colliding(ground) || ball.colliding(platform))) { ball.vel.y = -7;  jumpSound.play(); }
	
	
if (kb.pressing('left')) {
  if (ball.vel.x > 0) ball.applyForce(-30);  
  else ball.applyForce(-15);
}

if (kb.pressing('right')) {
  if (ball.vel.x < 0) ball.applyForce(30);
  else ball.applyForce(15);
}

  
if (platform.x > 1000) {
  platform.vel.x = '-2'; 
  platform.vel.y = 0; 

} 
else if (platform.x < 200) {
platform.vel.y = 0; 
  platform.vel.x = '2';  
}
if (ball.colliding(platform) && ball.vel.y >= 0) {
  ball.x += platform.vel.x
}

if (ball.colliding(spikes)){
	respawn(); 
}
let worldMouseX = mouseX + camera.x - halfWidth;
let worldMouseY = mouseY + camera.y - halfHeight;
fill('black');
  textSize(16);
  textAlign(LEFT, TOP);
  text(`Mouse: ${worldMouseX}, ${worldMouseY}`, 10, 10);


}