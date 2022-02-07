import Sprite from './sprite.js';

class Score extends Sprite {
  constructor(color = 'black', score = 0, font = '16px Arial') {
    super();
    this.score = score;
    this.font = font;
    this.color = color;
  }

  update(points) {
    this.score += points;
  }

  reset() {
    this.score = 0;
  }

  render(ctx) {
    ctx.font = this.font;
    ctx.fillStyle = this.color;
    ctx.fillText(`Score: ${this.score}`, 8, 20);
  }
}

export default Score;
