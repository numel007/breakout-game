import Sprite from './sprite.js';

class Lives extends Sprite {
  constructor(width, color = 'black', lives = 3, font = '16px Arial') {
    super();
    this.width = width;
    this.lives = lives;
    this.font = font;
    this.color = color;
  }

  loseLife() {
    this.lives -= 1;
  }

  reset() {
    this.lives = 3;
  }

  render(ctx) {
    ctx.font = this.font;
    ctx.fillStyle = this.color;
    ctx.fillText(`Lives: ${this.lives}`, this.width - 65, 20);
  }
}

export default Lives;
