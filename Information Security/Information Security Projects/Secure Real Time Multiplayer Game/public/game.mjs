import Player from './Player.mjs';
import Collectible from './Collectible.mjs';

const GRID_SIZE = 12;
// const PLAYER_LIMIT = (GRID_SIZE**2)-1; <--- Maximum Players
const PLAYER_LIMIT = 20;

function initGame(id, gameState) {
  let state;
  if (!gameState) { // Initial
    state = initGameState();
    let coords = randomCoords();
    const newPlayer = new Player(coords.x, coords.y, id);
    state.players[id] = newPlayer;
    coords = randomCoords([ newPlayer ]);
    state.collectible = new Collectible(coords.x, coords.y);
  } else { // New Player
    state = gameState;
    let playerCoords = [];
    Object.keys(gameState.players).map(i => {
      playerCoords.push({ 
        x: gameState.players[i].x, 
        y: gameState.players[i].y, 
      });
    });
    let coords = randomCoords([ ...playerCoords, gameState.collectible ]);
    const newPlayer = new Player(coords.x, coords.y, id);
    state.players[id] = newPlayer;
  }

  return state;

}

function initGameState() {
  return {
    players: {},
    collectible: {},
    gridSize: GRID_SIZE,
    playerLimit: PLAYER_LIMIT
  }
}

function randomCoords(list) {
  let coords = {
    x: Math.floor(Math.random() * GRID_SIZE),
    y: Math.floor(Math.random() * GRID_SIZE)
  }

  if (list) {
    for (let i = 0; i < list.length; i++) {
      if (list[i].x === coords.x && list[i].y === coords.y) {
        coords = randomCoords(list);
        break;
      }
    }
  } 

  return coords;
}

function calculateRank(players) {
  let playersArr = [];

  Object.keys(players).map(i => {
    playersArr.push({
      score: players[i].score,
      id: players[i].id
    });
  });

  playersArr.sort((a, b) => {
    return b.score - a.score;
  });

  return playersArr;
}

export {
  GRID_SIZE,
  initGame,
  randomCoords,
  calculateRank,
}

