import Ball from './ball.js';
import Brick from './brick.js';
import Paddle from './paddle.js';
import Score from './score.js';
import Lives from './lives.js';

class Game {
  constructor(
    canvas,
    document,
    ballRadius = 10,
    brickRowCount = 3,
    brickColumnCount = 5,
    brickWidth = 75,
    brickHeight = 20,
    brickPadding = 10,
    brickOffsetTop = 30,
    brickOffsetLeft = 30,
    row0Score = 50,
    row1Score = 20,
    row2Score = 10
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.document = document;
    this.ball = new Ball(canvas.width / 2, canvas.height - 30, ballRadius);
    this.paddle = new Paddle((canvas.width - 75) / 2, canvas.height - 10);
    this.score = new Score(0, 0, 'red', 0);
    this.lives = new Lives(canvas.width);
    this.brickRowCount = brickRowCount;
    this.brickColumnCount = brickColumnCount;
    this.brickWidth = brickWidth;
    this.brickHeight = brickHeight;
    this.brickPadding = brickPadding;
    this.brickOffsetLeft = brickOffsetLeft;
    this.brickOffsetTop = brickOffsetTop;
    this.row0Score = row0Score;
    this.row1Score = row1Score;
    this.row2Score = row2Score;
    this.bricks = [];
    this.leftPressed = false;
    this.rightPressed = false;

    console.log(this.ctx);

    for (let c = 0; c < brickColumnCount; c += 1) {
      this.bricks[c] = [];
      for (let r = 0; r < brickRowCount; r += 1) {
        if (r % 2 === 1) {
          this.bricks[c][r] = new Brick(0, 0, true, undefined, undefined, 'green');
        } else {
          this.bricks[c][r] = new Brick(0, 0, true, undefined, undefined, 'red');
        }
      }
    }
  }

  drawBricks() {
    for (let c = 0; c < this.brickColumnCount; c += 1) {
      for (let r = 0; r < this.brickRowCount; r += 1) {
        if (this.bricks[c][r].status === true) {
          const brickX = c * (this.brickWidth + this.brickPadding) + this.brickOffsetLeft;
          const brickY = r * (this.brickHeight + this.brickPadding) + this.brickOffsetTop;
          this.bricks[c][r].x = brickX;
          this.bricks[c][r].y = brickY;
          this.bricks[c][r].render(this.ctx);
        }
      }
    }
  }

  collisionDetection() {
    for (let c = 0; c < this.brickColumnCount; c += 1) {
      for (let r = 0; r < this.brickRowCount; r += 1) {
        const b = this.bricks[c][r];
        if (b.status === true) {
          if (
            this.ball.x > b.x &&
            this.ball.x < b.x + this.brickWidth &&
            this.ball.y > b.y &&
            this.ball.y < b.y + this.brickHeight
          ) {
            this.ball.dy = -this.ball.dy;
            b.status = 0;

            if (r === 2) {
              this.score.update(this.row2Score);
            } else if (r === 1) {
              this.score.update(this.row1Score);
            } else if (r === 0) {
              this.score.update(this.row0Score);
            }

            if (
              this.score.score ===
              this.brickColumnCount * this.row0Score +
                this.brickColumnCount * this.row1Score +
                this.brickColumnCount * this.row2Score
            ) {
              alert('Game complete');
              this.document.location.reload();
            }
          }
        }
      }
    }
  }

  keyDownHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
      this.rightPressed = true;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
      this.leftPressed = true;
    }
  }

  keyUpHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
      this.rightPressed = false;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
      this.leftPressed = false;
    }
  }

  runGame() {
    // function mouseMoveHandler(e) {
    //   const relativeX = e.clientX - this.canvas.offsetLeft;
    //   if (relativeX > 0 && relativeX < this.canvas.width) {
    //     this.paddle.x = relativeX - this.paddle.width / 2;
    //   }
    // }

    document.addEventListener('keydown', this.keyDownHandler, false);
    document.addEventListener('keyup', this.keyUpHandler, false);
    // document.addEventListener('mousemove', mouseMoveHandler, false);

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.collisionDetection();
    this.drawBricks();
    this.lives.render(this.ctx);
    this.score.render(this.ctx);
    this.ball.render(this.ctx);
    this.paddle.render(this.ctx);
    this.ball.move();

    if (this.ball.x + this.ball.dx > this.canvas.width || this.ball.x + this.ball.dx < 0) {
      this.ball.dx = -this.ball.dx;
    }

    if (this.ball.y + this.ball.dy < this.ballRadius) {
      this.ball.dy = -this.ball.dy;
    } else if (this.ball.y + this.ball.dy > this.canvas.height - this.ballRadius) {
      if (this.ball.x > this.paddle.x && this.ball.x < this.paddle.x + this.paddle.width) {
        this.ball.dy = -this.ball.dy;
      } else {
        this.lives.loseLife();
        if (this.lives.lives === 0) {
          alert('GAME OVER');
          document.location.reload();
        } else {
          this.ball.x = this.canvas.width / 2;
          this.ball.y = this.canvas.height - 30;
          this.ball.dx = 2;
          this.ball.dy = -2;
          this.paddle.x = (this.canvas.width - this.paddle.width) / 2;
        }
      }
    }

    if (this.rightPressed) {
      this.paddle.x += 7;
      if (this.paddle.x + this.paddle.width > this.canvas.width) {
        this.paddle.x = this.canvas.width - this.paddle.width;
      }
    } else if (this.leftPressed) {
      this.paddle.x -= 7;
      if (this.paddle.x < 0) {
        this.paddle.x = 0;
      }
    }

    requestAnimationFrame(this.runGame);
  }
}

export default Game;
