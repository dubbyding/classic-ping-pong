let userScore = 0;
let AIScore = 0;

function startGame() {
	/* Creating a new component. */
	myGamePieceUser = new component(
		10,
		gameElement.canvas.height / 2 + 40,
		'red',
		10,
		80,
		'rectangle'
	);
	gameElement.start();
	myGamePieceAI = new component(
		gameElement.canvas.width - 20,
		gameElement.canvas.height / 2 - 40,
		'red',
		10,
		80,
		'rectangle'
	);

	ball = new component(
		gameElement.canvas.width / 2 - 5,
		gameElement.canvas.height / 2 - 5,
		'#FF0000',
		10,
		10,
		'circle'
	);
}

let gameElement = {
	canvas: document.createElement('canvas'),
	start: function () {
		/* Creating a canvas element and setting the width and height of the canvas. It is also setting the
		context of the canvas to 2d. It is also inserting the canvas element before the first child node
		of the body. It is also setting the interval of the updateGameArea function to 20ms. It is also
		setting the interval of the playerMovement function to 20ms. */
		this.canvas.width = 550;
		this.canvas.height = 350;
		this.context = this.canvas.getContext('2d');
		document.body.insertBefore(this.canvas, document.body.childNodes[0]);
		this.interval = setInterval(updateGameArea, 20);
		this.keyCheck = setInterval(playerMovement, 20);
		this.aiCheck = setInterval(AIMovement, 20);
		this.text = setInterval(textdisplay, 20);
	},
	clear: function () {
		/* Clearing the canvas. */
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	},
};

function component(x, y, color, width, height, type) {
	/* Creating a new object. */
	this.x = x;
	this.y = y;
	this.speedY = 0;
	this.color = color;
	this.width = width;
	this.height = height;
	this.type = type;

	this.ballSpeedX = 1;
	this.ballSpeedY = 1;

	this.update = () => {
		/* Drawing the rectangle and the circle. */
		ctx = gameElement.context;
		ctx.fillStyle = this.color;
		if (this.type == 'rectangle') {
			ctx.fillRect(this.x, this.y, this.width, this.height);
		} else if (this.type == 'circle') {
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.width / 2, 0, 2 * Math.PI);
			ctx.stroke();
		}
	};
	this.ballMovement = () => {
		/* Checking if the ball is colliding with the border of the canvas. */
		let top = this.x;
		let bottom = this.x + this.width / 2;
		let left = this.y;
		let right = this.y - this.width / 2;
		if (top < 0) {
			this.ballSpeedX = 1;
		}
		if (bottom > gameElement.canvas.width) {
			this.ballSpeedX = -1;
		}
		if (left > gameElement.canvas.height) {
			this.ballSpeedY = -1;
		}
		if (right < 0) {
			this.ballSpeedY = 1;
		}
		this.x += this.ballSpeedX;
		this.y += this.ballSpeedY;
	};
	this.playerBallCollision = (player, obj) => {
		/* Checking if the ball is colliding with the player. */
		let top = this.y - this.width / 2;
		let bottom = this.y + this.width / 2;
		let left = this.x - this.width / 2;
		let right = this.x + this.width / 2;

		let anotherTop = obj.y;
		let anotherBottom = obj.y + obj.height;
		let anotherLeft = obj.x;
		let anotherRight = obj.x + obj.width;
		if (player == 'user') {
			if (
				!(anotherBottom < top || anotherTop > bottom) &&
				!(anotherLeft > right || anotherRight < left)
			) {
				this.ballSpeedX *= -1;
			}
		} else {
			if (
				!(anotherBottom < top || anotherTop > bottom) &&
				(!(anotherLeft > right) || anotherRight < left)
			) {
				this.ballSpeedX *= -1;
			}
		}
	};
}

function borderSet(width, height, color) {
	/* Setting the border of the canvas. */
	this.color = color;
	this.width = width;
	gameElement.context.lineWidth = this.width;
	gameElement.context.strokeStyle = this.color;
	gameElement.context.strokeRect(
		0,
		0,
		gameElement.canvas.width,
		gameElement.canvas.height
	);
}
function textdisplay() {
	let ctx = gameElement.context;
	ctx.font = '10px Comic Sans MS';
	ctx.fillStyle = 'red';
	ctx.textAlign = 'center';
	ctx.fillText('Score Player = ' + String(userScore), 50, 20);
	ctx.fillText('Score AI = ' + String(AIScore), 500, 20);
}
function playerMovement() {
	/* A function that is called every 20ms. It checks if the key is w or s and changes the speed of the
	player accordingly. */
	window.onkeydown = ({ key }) => {
		if (key == 'w') {
			speedY = -4;
		} else if (key == 's') {
			speedY = 4;
		} else {
			return;
		}
		myGamePieceUser.y += speedY;
	};
	if (ball.x - 10 < 0) {
		AIScore += 1;
	}
}

function AIMovement() {
	let x = ball.x;
	let y = ball.y;
	let directionX = ball.ballSpeedX;
	let directionY = ball.ballSpeedY;
	let diff = 530 - x;
	let pos = y + directionX * diff;
	if (pos < 0) {
		pos *= -1;
	}
	if (pos > 350) {
		pos = 350 - (pos - 350);
	}
	if (myGamePieceAI.y + 40 < pos) {
		speedY = 4;
	} else {
		speedY = -4;
	}
	if (diff > 0) {
		myGamePieceAI.y += speedY;
	} else {
		userScore += 1;
	}
}

function updateGameArea() {
	/* Clearing the canvas, setting the border of the canvas, updating the player, updating the AI, moving
	the ball, checking if the ball is colliding with the player, checking if the ball is colliding with
	the AI, and updating the ball. */
	gameElement.clear();
	borderSet(1, '#000000');
	myGamePieceUser.update();
	myGamePieceAI.update();
	ball.ballMovement();
	ball.playerBallCollision('user', myGamePieceUser);
	ball.playerBallCollision('AI', myGamePieceAI);
	ball.update();
}
