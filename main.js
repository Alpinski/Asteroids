var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");


window.addEventListener('keydown', function(evt) { onKeyDown(evt); }, false);
window.addEventListener('keyup', function(evt) { onKeyUp(evt); }, false);

var startFrameMillis = Date.now();
var endFrameMillis = Date.now();

function getDeltaTime()
{
	endFrameMillis = startFrameMillis;
	startFrameMillis = Date.now();
	var deltaTime = (startFrameMillis - endFrameMillis) * 0.001;
	if (deltaTime > 1)
	{
	deltaTime = 1;
	}
	return deltaTime;
}

var STATE_SPLASH = 0;
var STATE_CONTROLS = 1;
var STATE_GAME = 2;
var STATE_GAMEOVER = 3;

var gameState = STATE_SPLASH;

var playerScore = 0;

var SCREEN_WIDTH = canvas.width;
var SCREEN_HEIGHT = canvas.height;
var ASTEROID_SPEED = 200;
var PLAYER_SPEED = 700;
var PLAYER_TURN_SPEED = 5;
var PLAYER_STRAFE_SPEED = 700;
var BULLET_SPEED = 1000;

var KEY_SPACE = 32;
var KEY_LEFT = 37;
var KEY_UP = 38;
var KEY_RIGHT = 39;
var KEY_DOWN = 40;
var KEY_A = 65;
var KEY_D = 68;
var ENTER = 13;
var KEY_Z = 90;

var tempScore = 0;


function restart()
{
	playerScore = 0;
	player.x = SCREEN_WIDTH/2;
	player.y = SCREEN_HEIGHT/2;
	player.rotation = 0;
	player.directionX = 0;
	player.directionY = 0;
	player.angularDirection = 0;
	player.isDead = false;
	asteroids = [];
	context.textBaseline = "bottom";
	bullets = [];
	checkNuke = 3;
}

var player = {
	image: document.createElement("img"),
	x: SCREEN_WIDTH/2,
	y: SCREEN_HEIGHT/2,
	width: 93,
	height: 80,
	directionX: 0,
	directionY: 0,
	angularDirection: 0,
	rotation: 0,
	isDead: false
};
player.image.src = "Sprites/CIShip.png";

var iShoot = false;

var asteroids = [];

var bullets = [];

var checkNuke = 3;
var Nukeboom = false;
var NukeTimer = 0;
var NukeLength = 3;
var NukeWhite = 1.5;
var nukeKills = 15; 

var space = document.createElement("img")
space.src = "Sprites/GridS.png";

var shootS = document.createElement("audio")
shootS.src = "Sounds/TankShot.mp3";

var Hazzard = document.createElement("img")
Hazzard.src = "sprites/nuclear.png";

var Heart = document.createElement("img")
Heart.src = "sprites/Heart.png";

var shootTimer = 0;
var shootRate = 0.3;
function onKeyDown(event)
{
	if(event.keyCode == KEY_UP)
	{
	player.directionY = 1;
	}
	if(event.keyCode == KEY_DOWN)
	{
	player.directionY = -1;
	}
	if(event.keyCode == KEY_LEFT)
	{
	player.angularDirection = -1;
	}
	if(event.keyCode == KEY_RIGHT)
	{
	player.angularDirection = 1;
	}
	if(event.keyCode == KEY_A)
	{
	player.directionX = -1;
	}
	if(event.keyCode == KEY_D)
	{
	player.directionX = 1;
	}
	if(event.keyCode == ENTER)
	{
	if(gameState == STATE_SPLASH)
	{
	gameState = STATE_CONTROLS;
	}
	else if(gameState == STATE_CONTROLS)
	{
	gameState = STATE_GAME	
	}
	if(gameState == STATE_GAMEOVER)	
		{
			restart()
			gameState = STATE_SPLASH;
		}
	}
	if(event.keyCode == KEY_SPACE)
	{
	if (player.isDead == false)
		{
		iShoot = true;
		}
	}
	if(event.keyCode == KEY_Z && Nukeboom == false && checkNuke >0)
	{
	Nukeboom = true;
	NukeTimer = NukeLength;
	checkNuke--;
	}
}

function onKeyUp(event)
{
	if(event.keyCode == KEY_UP)
	{
	player.directionY = 0;
	}
	if(event.keyCode == KEY_DOWN)
	{
	player.directionY = 0;
	}
	if(event.keyCode == KEY_LEFT)
	{
	player.angularDirection = 0;
	}
	if(event.keyCode == KEY_RIGHT)
	{
	player.angularDirection = 0;
	}
	if(event.keyCode == KEY_A)
	{
	player.directionX = -0;
	}
	if(event.keyCode == KEY_D)
	{
	player.directionX = 0;
	}
	if(event.keyCode == KEY_SPACE)
	{
	iShoot = false;
	}
}


function intersects(x1, y1, w1, h1, x2, y2, w2, h2)
{
if(y2 + h2 < y1 ||
x2 + w2 < x1 ||
x2 > x1 + w1 ||
y2 > y1 + h1)
{
return false;
}
return true;
}

function runSplash(deltaTime)
{
	context.fillStyle = "green";
	context.font = "128px impact";
	context.textBaseline = "bottom";
	context.fillText("ASTEROIDS", 675, 500);
	context.font = "52px impact"
	context.fillText("PRESS ENTER", 815, 700)
}

function runControls(deltaTime)
{
	context.fillStyle = "green";
	context.font="128px impact";
	context.textBaseline = "bottom";
	context.fillText("CONTROLS", 675, 150);
	context.font="72px impact";
	context.fillText("ARROW KEYS = MOVEMENT AND ROTATION", 425, 275)
	context.fillText("SPACE = SHOOT", 425, 400)
	context.fillText("Z = NUKE", 425, 525)
	context.fillText("A = STRAFE LEFT", 425, 650)
	context.fillText("D = STRAFE RIGHT", 425, 775)
	context.fillText("ENTER = ADVANCE TO GAME", 425, 900)
}

function runGame(deltaTime)
{
	context.drawImage(space, 0,0)
	if(checkNuke == 3)
	{
	context.drawImage(Hazzard, 0, SCREEN_HEIGHT-64, 64, 64)
	context.drawImage(Hazzard, 64, SCREEN_HEIGHT-64, 64, 64)
	context.drawImage(Hazzard, 128, SCREEN_HEIGHT-64, 64, 64)
	}
	if(checkNuke == 2)
		{
		context.drawImage(Hazzard, 0, SCREEN_HEIGHT-64, 64, 64)
		context.drawImage(Hazzard, 64, SCREEN_HEIGHT-64, 64, 64)
		}
	if(checkNuke == 1)
	{
	context.drawImage(Hazzard, 0, SCREEN_HEIGHT-64, 64, 64)	
	}
	
	if(shootTimer > 0)
	shootTimer -= deltaTime;

	for(var i=0; i<bullets.length; i++)
	{
		bullets[i].x += bullets[i].velocityX * deltaTime;
		bullets[i].y += bullets[i].velocityY * deltaTime;
	}
	for(var i=0; i<bullets.length; i++)
	{
		if(bullets[i].x < -bullets[i].width || bullets[i].x > SCREEN_WIDTH || bullets[i].y < -bullets[i].height || bullets[i].y > SCREEN_HEIGHT)
		{
		bullets.splice(i, 1);
		break;
		}
	}
	for(var i=0; i<bullets.length; i++)
	{
	DrawImage(context, bullets[i].image, bullets[i].x - bullets[i].width/2, bullets[i].y - bullets[i].height/2, bullets[i].rotation);
	}
	
	if(iShoot && shootTimer <= 0)
		{
		shootTimer = shootRate;
		playerShoot();
		}
		
	var s = Math.sin(player.rotation);
	var c = Math.cos(player.rotation);
	
	var xDir = (player.directionX * c) - (player.directionY * s);
	var yDir = (player.directionX * s) + (player.directionY * c);
	var xVel = xDir * PLAYER_SPEED;
	var yVel = yDir * PLAYER_SPEED;
	var xVel = xDir * PLAYER_STRAFE_SPEED;
	var yVel = yDir * PLAYER_STRAFE_SPEED;
	
	player.x += xVel * deltaTime;
	player.y += yVel * deltaTime;
	
	player.rotation += player.angularDirection * PLAYER_TURN_SPEED * deltaTime;
	
	for(var i=0; i<asteroids.length; i++)
		{
			asteroids[i].x = asteroids[i].x + asteroids[i].velocityX * deltaTime;
			asteroids[i].y = asteroids[i].y + asteroids[i].velocityY * deltaTime;
		}
		
	for(var i=0; i<asteroids.length; i++)
		{
		DrawImage(context, asteroids[i].image, asteroids[i].x, asteroids[i].y, asteroids.rotation);
		}
	
	spawnTimer -= deltaTime;
	
	if(spawnTimer <= 0)
		{
			spawnTimer = 2-Math.floor(playerScore/25)*0.1;
			spawnAsteroid();
		}
		if(player.isDead == false)
		{
		DrawImage(context, player.image, player.x, player.y, player.rotation)
		
	for(var i=0; i<asteroids.length; i++)
		{	
			var hit = intersects(player.x, player.y, player.width, player.height, asteroids[i].x, asteroids[i].y, asteroids[i].width, asteroids[i].height);
		
		if(hit == true)
		{
			player.isDead = true;
			asteroids.splice(i, 1);
			break;
		}
	}	
	if(player.x >= SCREEN_WIDTH + 80)
	{
		player.x = 0
	}
	if(player.x <= 0 - 80)
	{
		player.x = SCREEN_WIDTH + 80
	}
	if(player.y >= SCREEN_HEIGHT + 93)
	{
		player.y = 0
	}
	if(player.y <= 0 - 93)
	{
		player.y =SCREEN_HEIGHT + 93
	}
	
	for(var i=0; i<asteroids.length; i++)
	{
			if(asteroids[i].x >= SCREEN_WIDTH + 95)
		{
			asteroids[i].x = 0
		}
		if(asteroids[i].x <= 0 - 95)
		{
			asteroids[i].x = SCREEN_WIDTH + 95
		}
		if(asteroids[i].y >= SCREEN_HEIGHT + 93)
		{
			asteroids[i].y = 0
		}
		if(asteroids[i].y <= 0 - 93)
		{
			asteroids[i].y =SCREEN_HEIGHT + 93
		}
	}
		}        
		for(var i=0; i<asteroids.length; i++)
		{
		for(var j=0; j<bullets.length; j++)
		{
			if(intersects(bullets[j].x, bullets[j].y, bullets[j].width, bullets[j].height, asteroids[i].x, asteroids[i].y, asteroids[i].width, asteroids[i].height) == true)
			{
				asteroids.splice(i, 1);
				bullets.splice(j, 1);
				playerScore += 1;
				if(playerScore % 10 == 0 && checkNuke<3)
					{
					checkNuke++
					}
				break;
			}
		}
	}
	context.fillStyle = "rgba(55, 55, 55, 0.75)"
	context.fillStyle = "green";
	context.font = "52px impact";
	context.textBaseline = "top";
	context.fillText(playerScore, 10,10);
	
	if (player.isDead == true)
	{
	
		gameState = STATE_GAMEOVER;
		return;
	}
	if (Nukeboom == true)
	{
	NukeTimer -= deltaTime
	if (NukeTimer < NukeWhite)
		{
		context.fillStyle = "rgba(255,255,255,"+(NukeTimer/NukeWhite)+")";
		playerScore += asteroids.length;
		asteroids = []
		}
		else 
		{
		context.fillStyle = "rgba(255,255,255,"+((NukeLength-NukeTimer)/NukeWhite)+")";
		}
		context.fillRect(0, 0, canvas.width, canvas.height);
		if(NukeTimer < 0)
			{
			Nukeboom = false
			}
	
	}
}

function runGameOver(deltaTime)
{
	context.fillStyle = "green";
	context.font = "128px impact";
	context.textBaseline = "middle";
	context.fillText("GAME OVER", 655, 375);
	context.fillText(playerScore, 890, 520);
	context.font = "52px impact";
	context.fillText("PRESS ENTER", 815, 900)
}

var spawnTimer = 0;
function run()
{
	context.fillStyle = "black";
	context.fillRect(0, 0, canvas.width, canvas.height);
	
	var deltaTime = getDeltaTime();
	
	switch(gameState)
	{
		case STATE_SPLASH:
			runSplash(deltaTime);
			break;
		case STATE_CONTROLS:
			runControls(deltaTime)
			break;
		case STATE_GAME:
			runGame(deltaTime);
			break;
		case STATE_GAMEOVER:
			runGameOver(deltaTime);
			break;
	}
}


	
function rand(floor, ceil)
{
	return Math.floor( (Math.random()* (ceil-floor)) +floor );
}
	
function spawnAsteroid()
{
	var type = rand(0, 3);
		
	var asteroid = {};
		
	asteroid.image = document.createElement("img");
	asteroid.image.src = "Sprites/rock_large.png";
	asteroid.width = 69;
	asteroid.height = 75;
	asteroid.rotation = 0;
	
	var x = SCREEN_WIDTH/2;
	var y = SCREEN_HEIGHT/2;
	
	var dirX = rand(-10,10);
	var dirY = rand(-10,10);

	var magnitude = (dirX * dirX) + (dirY * dirY);
	if(magnitude != 0)
	{
		var oneOverMag = 1 / Math.sqrt(magnitude);
		dirX *= oneOverMag;
		dirY *= oneOverMag;
	}
	var movX = dirX * SCREEN_WIDTH;
	var movY = dirY * SCREEN_HEIGHT;
	
	asteroid.x = x + movX;
	asteroid.y = y + movY;
		
	asteroid.velocityX = -dirX * ASTEROID_SPEED;
	asteroid.velocityY = -dirY * ASTEROID_SPEED;
		
	asteroids.push(asteroid);
}

function DrawImage (ctx, img, posX, posY, ang)
{
	ctx.save();
		ctx.translate(posX, posY);
		ctx.rotate(ang);
		ctx.drawImage(img, -img.width/2, -img.height/2);
	ctx.restore();
}

function playerShoot()
{
	var bullet = {
		image: document.createElement("img"),
		x: player.x,
		y: player.y,
		width: 5,
		height: 5,
		velocityX: 0,
		velocityY: 0,
		rotation: player.rotation
	};
	
	bullet.image.src = "Sprites/fireballs.png";

	var velX = 0;
	var velY = 1;

	var s = Math.sin(player.rotation);
	var c = Math.cos(player.rotation);

	var xVel = (velX * c) - (velY * s);
	var yVel = (velX * s) + (velY * c);
	
	shootS.play();
	
	bullet.velocityX = xVel * BULLET_SPEED;
	bullet.velocityY = yVel * BULLET_SPEED;

	bullets.push(bullet);
}

(function() {
 var onEachFrame;
 if (window.requestAnimationFrame) {
	onEachFrame = function(cb) {
		var _cb = function() { cb(); window.requestAnimationFrame(_cb); }
		_cb();
	};
} else if (window.mozRequestAnimationFrame) {
	onEachFrame = function(cb) {
		var _cb = function() { cb();
window.mozRequestAnimationFrame(_cb); }
		_cb();
	};
} else {
	onEachFrame = function(cb) {
		setInterval(cb, 1000 / 144);
	}
 }

 window.onEachFrame = onEachFrame;
 })();
window.onEachFrame(run);