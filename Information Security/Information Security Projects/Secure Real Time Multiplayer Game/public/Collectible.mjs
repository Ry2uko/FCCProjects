import { randomCoords } from './game.mjs';

class Collectible {
  constructor(x, y, value = 1) {
    this.x = x;
    this.y = y;
    this.value = value;
  }

  collision(gameState) {
    let playerCoords = [];
    Object.keys(gameState.players).map(i => {
      playerCoords.push({ 
        x: gameState.players[i].x, 
        y: gameState.players[i].y, 
      });
    });
    let coords = randomCoords([ ...playerCoords ]);
    this.x = coords.x;
    this.y = coords.y;
  }
}

try {
  module.exports = Collectible;
} catch(e) {}

export default Collectible;