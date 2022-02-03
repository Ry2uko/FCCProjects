require('dotenv').config();
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const nocache = require('nocache');
const cors = require('cors');
const { Server } = require('socket.io');

const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner.js');
const {
  initGame,
  calculateRank
} = require('./public/game.mjs');
const { default: Player } = require('./public/Player.mjs');
const { default: Collectible } = require('./public/Collectible.mjs');


const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use('/static', express.static(process.cwd() + '/public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Security
app.use(helmet.noSniff());
app.use(nocache());
app.use((req, res, next) => {
  res.set({
    'X-Powered-By': 'PHP 7.4.3',
    'X-Xss-Protection': '1; mode=block'
  });
  next();
});
app.use(cors({origin: '*'})); 

app.route('/').get((req, res) => {
  res.sendFile(process.cwd() + '/views/index.html');
});

fccTestingRoutes(app); // fCC Testing

// 404 Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

// Socket
let gameState = {},
clientNum = 0;

io.on('connection', client => {
  clientNum += 1;

  // Clients On
  client.on('disconnect', () => {
    delete gameState.players[client.id];
    clientNum -= 1;
    rankArr = calculateRank(gameState.players);
    client.broadcast.emit('updateRank', rankArr);
    client.broadcast.emit('updateFrame', gameState);
  });

  client.on('keydown', handleKeyDown);
  
  // State Init | New Player
  if (clientNum === 1) {
    gameState = initGame(client.id);
  } else {
    if (
      Object.keys(gameState.players).length === gameState.playerLimit
    ) {
      client.emit('serverFull'); 
      return;
    }
    gameState = initGame(client.id, gameState);
  }

  // Client Emits

  if(clientNum > 1 ) {
    client.broadcast.emit('updateFrame', gameState);
    client.emit('init', clientNum, gameState, client.id);
  } else {
    client.emit('init', clientNum, gameState, client.id);
  }

  rankArr = calculateRank(gameState.players);
  io.emit('updateRank', rankArr);

  // Socket Handlers
  function handleKeyDown(key, clientId) {
    let player = gameState.players[clientId], 
    collectible = gameState.collectible, 
    res, rankArr;
    
    switch(key) {
      case 'a':
      case 'ArrowLeft':
        res = player.movePlayer('left');
        break;
      case 'd':
      case 'ArrowRight':
        res = player.movePlayer('right');
        break;
      case 'w':
      case 'ArrowUp':
        res = player.movePlayer('up');
        break;
      case 's':
      case 'ArrowDown':
        res = player.movePlayer('down')
    }

    if (res) {
      if (player.x === collectible.x && player.y === collectible.y) {
        collectible.collision(gameState);
        player.score += 1;
        rankArr = calculateRank(gameState.players);

        client.emit('updateScore', player.score);
        io.emit('updateRank', rankArr);
      }
      io.emit('updateFrame', gameState);
    }
  }

});

const portNum = process.env.PORT || 3000;

// Set up server and tests
server.listen(portNum, () => {
  console.log(`Listening on port ${portNum}`);
  if (process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch (error) {``
        console.log('Tests are not valid:');
        console.error(error);
      }
    }, 1500);
  }
});

module.exports = app; // For testing