import Sprite from './sprite.js';

class Brick extends Sprite {
  constructor(x, y, status, width = 75, height = 20, color = '#0095DD') {
    super(x, y, width, height, color);
    this.status = status;
  }
}

export default Brick;
