const socket = io();

socket.on('init', handleInit);
socket.on('updateFrame', handleUpdateFrame);
socket.on('serverFull', handleServerFull);
socket.on('updateScore', handleUpdateScore);
socket.on('updateRank', handleUpdateRank);

const BG_COLOR = '#14151F';
const MAINPLAYER_COLOR = '#4361ee';
const OTHERPLAYER_COLOR = '#F4EEEC';
const COLLECTIBLE_COLOR = '#ff4d52';

let numPlayer = 0, clientId, gridSize;

const selfScore = document.getElementById('selfScore'),
playersRank = document.getElementById('playersRank');

function paintGame(players, collectible, gridSize, id) {
  ctx.fillStyle = BG_COLOR;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  const size = canvas.width / gridSize;
  
  for (let player in players) {
    if (player === id) {
      ctx.fillStyle = MAINPLAYER_COLOR;
    } else {
      ctx.fillStyle = OTHERPLAYER_COLOR;
    }
    ctx.fillRect(players[player].x * size, players[player].y * size, size ,size);
  }

  ctx.fillStyle = COLLECTIBLE_COLOR;
  ctx.fillRect(collectible.x * size, collectible.y * size, size, size);

}

// Handlers
function handleInit(numClient, gameState, id) {
  numPlayer = numClient;
  clientId = id;
  gridSize = gameState.gridSize;

  const players = gameState.players,
  collectible = gameState.collectible;

  // Canvas
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');
  canvas.width = canvas.height = 700;
  paintGame(players, collectible, gridSize, clientId);

  selfScore.innerText = players[clientId].score;
  document.addEventListener('keydown', e => {
    socket.emit('keydown', e.key, clientId);
  })
}

function handleUpdateFrame(gameState) {
  const players = gameState.players,
  collectible = gameState.collectible;
  paintGame(players, collectible, gridSize, clientId);
}

function handleServerFull() {
  alert('Game Is Full. Try Again Later');  
}

function handleUpdateScore(score) {
  selfScore.innerText = score;
}

function handleUpdateRank(rankArr) {
  let rank;
  for (let i = 0; i < rankArr.length; i++) {
    if (rankArr[i].id === clientId) {
      rank = i+1;
      break;
    }
  }
  playersRank.innerText = `${rank} \/ ${rankArr.length}`;
}