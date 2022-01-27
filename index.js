import Ball from './ball.js';
import Brick from './brick.js';
import Paddle from './paddle.js';
import Score from './score.js';
import Lives from './lives.js';

// Nice organization, dumbass
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const ballRadius = 10;
const ball = new Ball(canvas.width / 2, canvas.height - 30, ballRadius);
const paddle = new Paddle((canvas.width - 75) / 2, canvas.height - 10);
const score = new Score(0, 0, 'red', 0);
const lives = new Lives(canvas.width);

// Brick row setup
const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

// Brick row scores
const row0Score = 50;
const row1Score = 20;
const row2Score = 10;

// Keypress detection
let rightPressed = false;
let leftPressed = false;

const bricks = [];
for (let c = 0; c < brickColumnCount; c += 1) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r += 1) {
    if (r % 2 === 1) {
      bricks[c][r] = new Brick(0, 0, true, undefined, undefined, 'green');
    } else {
      bricks[c][r] = new Brick(0, 0, true, undefined, undefined, 'red');
    }
  }
}

const drawBricks = () => {
  for (let c = 0; c < brickColumnCount; c += 1) {
    for (let r = 0; r < brickRowCount; r += 1) {
      if (bricks[c][r].status === true) {
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        bricks[c][r].render(ctx);
      }
    }
  }
};

const keyDownHandler = (e) => {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = true;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = true;
  }
};

const keyUpHandler = (e) => {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = false;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = false;
  }
};

const mouseMoveHandler = (e) => {
  const relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddle.x = relativeX - paddle.width / 2;
  }
};

const collisionDetection = () => {
  for (let c = 0; c < brickColumnCount; c += 1) {
    for (let r = 0; r < brickRowCount; r += 1) {
      const b = bricks[c][r];
      if (b.status === true) {
        if (
          ball.x > b.x &&
          ball.x < b.x + brickWidth &&
          ball.y > b.y &&
          ball.y < b.y + brickHeight
        ) {
          ball.dy = -ball.dy;
          b.status = 0;

          if (r === 2) {
            score.update(row2Score);
          } else if (r === 1) {
            score.update(row1Score);
          } else if (r === 0) {
            score.update(row0Score);
          }

          if (
            score.score ===
            brickColumnCount * row0Score +
              brickColumnCount * row1Score +
              brickColumnCount * row2Score
          ) {
            alert('Game complete');
            document.location.reload();
          }
        }
      }
    }
  }
};

const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  collisionDetection();
  drawBricks();
  lives.render(ctx);
  score.render(ctx);
  ball.render(ctx);
  paddle.render(ctx);
  ball.move();

  if (ball.x + ball.dx > canvas.width || ball.x + ball.dx < 0) {
    ball.dx = -ball.dx;
  }

  if (ball.y + ball.dy < ballRadius) {
    ball.dy = -ball.dy;
  } else if (ball.y + ball.dy > canvas.height - ballRadius) {
    if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
      ball.dy = -ball.dy;
    } else {
      lives.loseLife();
      if (lives.lives === 0) {
        alert('GAME OVER');
        document.location.reload();
      } else {
        ball.x = canvas.width / 2;
        ball.y = canvas.height - 30;
        ball.dx = 2;
        ball.dy = -2;
        paddle.x = (canvas.width - paddle.width) / 2;
      }
    }
  }

  if (rightPressed) {
    paddle.x += 7;
    if (paddle.x + paddle.width > canvas.width) {
      paddle.x = canvas.width - paddle.width;
    }
  } else if (leftPressed) {
    paddle.x -= 7;
    if (paddle.x < 0) {
      paddle.x = 0;
    }
  }

  requestAnimationFrame(draw);
};

draw();

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('mousemove', mouseMoveHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
