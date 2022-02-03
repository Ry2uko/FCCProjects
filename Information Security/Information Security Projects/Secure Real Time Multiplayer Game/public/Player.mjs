import { GRID_SIZE } from './game.mjs';

class Player {
  constructor(x, y, id, score = 0) {
    this.x = x;
    this.y = y;
    this.id = id;
    this.score = score;
  }

  movePlayer(dir) {
    switch(dir) {
      case 'left':
        if (this.x > 0) {
          this.x -= 1;
          return true
        } else {
          return false;
        }
      case 'right':
        if (this.x < GRID_SIZE-1) {
          this.x += 1;
          return true;
        } else {
          return false;
        }
      case 'down':
        if (this.y < GRID_SIZE-1) {
          this.y += 1;
          return true;
        } else {
          return false;
        }
      case 'up':
        if (this.y > 0) {
          this.y -= 1;
          return true;
        } else {
          return false;
        }
    }
  }

}

export default Player;