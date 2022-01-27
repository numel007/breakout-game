import Sprite from './sprite.js';

class Paddle extends Sprite {
  constructor(x, y, width = 75, height = 10, color = 'black') {
    super(x, y, width, height, color);
  }
}

export default Paddle;
