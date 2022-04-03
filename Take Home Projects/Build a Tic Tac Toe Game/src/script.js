// board canvas: https://codepen.io/solartic/pen/qEGqN
// Hacked by Ry2uko ;}
let gameMode,
    playAs,
    playerPlayAs;

const playersRef = {
  'playas-x': 1,
  'playas-o': 0,
  'playasarr': ['playas-o', 'playas-x']
}
const constants = {
  canvas_size: 531,
  bg_color: '#fff',
  x_color: '#FF686B',
  o_color: '#668cff',
  tie_color: '#B37AB5',
  board_line_color: '#212121',
  board_line_width: 5,
  board_line_offset: 10,
  piece_line_width: 5,
  piece_xline_offset: 50,
  piece_oarc_size: 100,
  winner_line_width: 4,
  winner_line_offset: 45,
};
const playersQuery = {
  0: $('#2player a'),
  1: $('#1player a')
},
boardCoords = [];

let currPlayer, playersScore, gameEnded, gameStarted, goingHome, board; 
let canvas, context; 
let canvasSize, sectionSize; 


// States
function gameInit() {
  canvas = $('#board')[0];
  context = canvas.getContext('2d');
  
  canvasSize = constants.canvas_size;
  sectionSize = canvasSize / 3; 
  canvas.width = canvas.height = canvasSize;
  
  playersScore = {
    x: 0,
    o: 0
  }
}
function generateBoardCoords() {
 for (let x = 0; x < canvasSize; x += sectionSize) {
   let arr = [];
   for (let y = 0; y < canvasSize; y += sectionSize) {
     arr.push([x, y]);
   }
   boardCoords.push(arr);
 }
}
function getCanvasMousePos(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  }
}
function addPiece(xpos, ypos) {
  if (gameMode === 'vsbot') {
    if (playersRef.playasarr[currPlayer] !== playersRef.playasarr[playerPlayAs]) return;
  }
  let xCoord, yCoord;
  
  function startAdd(xindex, yindex, xcoord, ycoord) {
    if (board[yindex][xindex] !== '') return;
    
    if (currPlayer) {
      drawPiece('X', xcoord, ycoord);
      board[yindex][xindex] = 'X';
      currPlayer = 0;
    } else {
      drawPiece('O', xcoord, ycoord);
      board[yindex][xindex] = 'O';
      currPlayer = 1;
    }
    
    if (hasWinner()) return;
    
    $('.player-option a').attr('class', '');
    playersQuery[currPlayer].attr('class', 'active');
    
    if (gameMode === 'vsbot') {
      setTimeout(() => {
        moveBot();
      }, 750);
    } 
  }
  
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      xCoord = x * sectionSize;
      yCoord = y * sectionSize;
      if (
        xpos >= xCoord 
        && ypos >= yCoord
        && xpos <= xCoord + sectionSize 
        && ypos <= yCoord + sectionSize
      ) startAdd(x, y, xCoord, yCoord);        
    }
  } 
}
function checkWinner(nBoard = [...board]) {
  // Check horizontal & vertical
  for (let x = 0; x < 3; x++) {
    let verticalPiece = nBoard[0][x],
    verticalPieceCoords = boardCoords[x][0],
    horizontalPiece = nBoard[x][0],
    horizontalPieceCoords = boardCoords[0][x],        
    horizontalValid = true,
    verticalValid = true;
    for (let y = 0; y < 3; y++) {
      if (nBoard[x][y] !== horizontalPiece || nBoard[x][y] === '') horizontalValid = false;
      if (nBoard[y][x] !== verticalPiece || nBoard[y][x] === '') verticalValid = false;
    }
    if (horizontalValid) return [horizontalPiece, horizontalPieceCoords, 'horizontal'];
    if (verticalValid) return [verticalPiece, verticalPieceCoords, 'vertical'];
  }
  
  // Check diagonal
  let ltrPiece = nBoard[0][0],
  ltrPieceCoords = boardCoords[0][0],
  rtlPiece = nBoard[0][2],
  rtlPieceCoords = boardCoords[2][0],
  ltrValid = true,
  rtlValid = true;
  
  for (let xy = 0; xy < 3; xy++) {
    if (nBoard[xy][2-xy] !== rtlPiece || nBoard[xy][2-xy] === '') rtlValid = false;
    if (nBoard[xy][xy] !== ltrPiece || nBoard[xy][xy] === '') ltrValid = false;
  }

  if (ltrValid) return [ltrPiece, ltrPieceCoords, 'diagonal-ltr'];
  if (rtlValid) return [rtlPiece, rtlPieceCoords, 'diagonal-rtl'];
  
  // Check board if full
  let boardIsFull = isBoardFull(nBoard);
  if (boardIsFull) {
    return ['tie', [null, null], [null, null]];
  }
  
  return false;
}
function hasWinner() {
  let result = checkWinner();
    if (result) {
      switch(result[0]) {
        case 'X':
          $('#result').html('Winner: <span class="winner-x">X</span>');
          playersScore['x'] += 1;
          break;
        case 'O':
          $('#result').html('Winner: <span class="winner-o">O</span>').css;
          playersScore['o'] += 1;
          break;
        case 'tie': 
          $('#result').html('<span class="winner-tie">Tie</span>');
      }
      
      for (let piece in playersScore) {
        $(`.score-${piece} span.score`).text(playersScore[piece]);
      }
      
      drawWinner(result[0], result[1], result[2]);
      gameEnded = true;
      resetGame();
      return true;
    }
  return false;
}
function isBoardFull(nBoard) {
  let isFull = true;
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      if (nBoard[x][y] === '') isFull = false
    }
  }
  return isFull;
}
function setPlayer() {
  if (gameMode === 'vsplayer') {
    switch(playAs) {
      case 'playas-x':
        currPlayer = 1;
        break;
      case 'playas-o':
        currPlayer = 0;
        break;
      case 'playas-random':
        currPlayer = Math.floor(Math.random() * 2); 
    } 
  } else {
    switch(playAs) {
      case 'playas-x':
        playerPlayAs = 1;
        break;
      case 'playas-o':
        playerPlayAs = 0;
        break;
      case 'playas-random':
        playerPlayAs = Math.floor(Math.random() * 2);
    }
    if (playerPlayAs) {
      playersQuery[1].html('You (<span class="option-x">X</span>)</a>');
      playersQuery[0].html('Bot (<span class="option-o">O</span>)</a>');
    } else {
      playersQuery[1].html('Bot (<span class="option-x">X</span>)</a>');
      playersQuery[0].html('You (<span class="option-o">O</span>)</a>');
    }
    currPlayer = 1;
  }
  
  
  $('.player-option a').attr('class', '');
  playersQuery[currPlayer].attr('class', 'active');
}
function resetGame() {
  let count = 3;
  const interval = setInterval(() => {
    if (count === 0) {
      clearInterval(interval);
      $('#reset-timer').text('');
      clearBoard();
      return;
    }
    $('#reset-timer').text(count);
    count--;
  }, 700);
}

// Canvas
function drawWinner(winner, coords, type) {
  if (winner === 'tie') return;
  const halfSectionSize = (0.5 * sectionSize),
  offset = constants.winner_line_offset;
  
  if (winner === 'X') {
    context.strokeStyle = constants.x_color;
  } else if (winner === 'O') {
    context.strokeStyle = constants.o_color;
  }
  
  context.lineWidth = constants.winner_line_width;
  context.beginPath();
  
  let lineStartX, lineStartY, lineEndX, lineEndY;
  
  switch(type) {
    case 'horizontal':
      lineStartX = coords[0] + offset;
      lineStartY = coords[1] + halfSectionSize;
      lineEndX = canvasSize - offset;
      lineEndY = lineStartY;
      break;
    case 'vertical':
      lineStartX = coords[0] + halfSectionSize;
      lineStartY = coords[1] + offset;
      lineEndX = lineStartX;
      lineEndY = canvasSize - offset;
      break;
    case 'diagonal-ltr':
      lineStartX = coords[0] + offset;
      lineStartY = coords[1] + offset;
      lineEndX = canvasSize - offset;
      lineEndY = canvasSize - offset;
      break;
    case 'diagonal-rtl':
      lineStartX = canvasSize - offset;
      lineStartY = coords[1] + offset;
      lineEndX = offset;
      lineEndY = canvasSize - offset;
  }
  
  context.moveTo(lineStartX, lineStartY);
  context.lineTo(lineEndX, lineEndY);
  context.stroke();
}
function drawBoard() {
  // Lines
  const lineStart = constants.board_line_offset;
  const lineLength = canvasSize - lineStart;
  context.lineWidth = constants.board_line_width;
  context.lineCap = 'round';
  context.strokeStyle = constants.board_line_color;
  context.beginPath();
  
  // Horizontal
  for (let y = 1; y <= 2; y++) {
    context.moveTo(lineStart, y * sectionSize);
    context.lineTo(lineLength, y * sectionSize);
  }
  
  // Vertical
  for (let x = 1; x <= 2; x++) {
    context.moveTo(x * sectionSize, lineStart);
    context.lineTo(x * sectionSize, lineLength);
  }
  
  context.stroke();
}
function drawPiece(piece, x, y) {
  context.beginPath();
  context.lineWidth = constants.piece_line_width;
  const offset = constants.piece_xline_offset;
  
  if (piece === 'X') {
    context.strokeStyle = constants.x_color;
    
    // left-to-right diagonal \
    context.moveTo(x + offset, y + offset);
    context.lineTo(x + sectionSize - offset, y + sectionSize - offset);
    
    // right-to-left diagonal /
    context.moveTo(x + offset, y + sectionSize - offset);
    context.lineTo(x + sectionSize - offset, y + offset);
  } else {
    context.strokeStyle = constants.o_color;
    
    const halfSectionSize = (0.5 * sectionSize),
    centerX = x + halfSectionSize,
    centerY = y + halfSectionSize,
    radius = (sectionSize - constants.piece_oarc_size) / 2,
    startAngle = 0,
    endAngle = 2 * Math.PI;
    
    context.arc(centerX, centerY, radius, startAngle, endAngle);
  }
  
  
  context.stroke();
  
}
function clearBoard(init = false) {
  context.fillStyle = constants.bg_color;
  context.fillRect(0, 0, canvasSize, canvasSize);
  
  $('#result').text('')
  setPlayer();
  
  gameEnded = false;
  board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ];
  
  drawBoard();
  
  if (gameMode === 'vsbot') {
    if ((playAs === 'playas-random' && playerPlayAs !== 1)
        || playAs === 'playas-o') {
      setTimeout(() => {
        moveBot();
      }, 650);
    } 
  }
}

// Title 
function addHover(elemval, color) {
  $(`button[value='${elemval}'`).on({
    'mouseenter': e => {
      if ($(e.target).attr('selected')) return;
      $(e.target).css('borderColor', color);
    },
    'mouseleave': e => {
      if ($(e.target).attr('selected')) return;
      $(e.target).css('borderColor', '#fff');
    },
  });
}
function startGame() {
  playersQuery[1].html('Player 1 (<span class="option-x">X</span>)</a>');
      playersQuery[0].html('Player 2 (<span class="option-o">O</span>)</a>');
  playersScore = {
    x: 0,
    o: 0
  }
  for (let piece in playersScore) {
    $(`.score-${piece} span.score`).text(playersScore[piece]);
  }
  
  gameInit(); // setting up canvas, etc.
  generateBoardCoords(); // board coords [x, y]
  clearBoard(true); // initialize state
  drawBoard(); // draw tic tac toe board
  
  $(canvas).on('mouseup', e => {
    if (gameEnded) return;
    const canvasMousePos = getCanvasMousePos(e);
    addPiece(canvasMousePos.x, canvasMousePos.y);
  });
  
  $('#game-screen').stop(true, false).animate({
        height: 'toggle',
        opacity: 'toggle'
   }, 1500);
  
  $('#game-screen').css('display', 'flex');
}

// Minimax Algorithm
function moveBot() {
  const randomCoords = () => {
    const x = Math.floor(Math.random() * 3);
    const y = Math.floor(Math.random() * 3);
    
    if (board[y][x] !== '') return randomCoords(); 
    return [x, y];
  }
  const randCoords = randomCoords();
  let xindex = randCoords[0],
  yindex = randCoords[1],
  xcoord = boardCoords[xindex][yindex][0],
  ycoord = boardCoords[xindex][yindex][1],
  playerPiece;
  
  if (currPlayer) {
    playerPiece = 'X';  
    currPlayer = 0;
  } else {
    playerPiece = 'O';
    currPlayer = 1;
  }

  drawPiece(playerPiece, xcoord, ycoord);
  board[yindex][xindex] = playerPiece;

  if(hasWinner()) return;
  
  $('.player-option a').attr('class', '');
  playersQuery[currPlayer].attr('class', 'active');
}

$(document).ready(function(){
  
  $('#gototitlescreen').on('click', () => {
    if (goingHome) return;
    goingHome = true;
    $('#game-screen').stop(true, false).animate({
        height: 'toggle',
        opacity: 'toggle'
    }, 900, () => {
      clearBoard();
      $('#title-screen').stop(true, false).animate({
        height: 'toggle',
        opacity: 'toggle'
      }, 900, () => {
        goingHome = false;
      });
    }); 
  });
  
  // CSS Buttons Hover
  addHover('vsbot', constants.x_color);
  addHover('vsplayer', constants.o_color);
  addHover('playas-x', constants.x_color);
  addHover('playas-o', constants.o_color);
  addHover('playas-random', constants.tie_color);
  
  // Implement Radio Buttons
  $('.vs-radio').on('click', e => {
    if (gameStarted) return;
    let vsVal = $(e.target).attr('value');
    
    $(`button[value="${gameMode}"]`).css({
        backgroundColor: '#fff',
        color: '#000',
        borderColor: '#fff'
      }).attr('selected', false);
    
    if (vsVal === gameMode) {
       $('div.playas-div h4').text('Play as / First Play:');
      gameMode = undefined;
      return;
    }
    
    if (vsVal === 'vsbot') {
      $('div.playas-div h4').text('Play as:');
      $(e.target).css({
        backgroundColor: constants.x_color,
        color: '#fff',
        borderColor: constants.x_color
      }).attr('selected', true);
    } else {
      $('div.playas-div h4').text('First Play:');
      $(e.target).css({
        backgroundColor: constants.o_color,
        color: '#fff',
        borderColor: constants.o_color
      }).attr('selected', true);
    }
    
    gameMode = vsVal;
    
  });
  $('.playas-radio').on('click', e => {
    if (gameStarted) return;
    let playasVal = $(e.target).attr('value');
    
    $(`button[value="${playAs}"]`).css({
      backgroundColor: '#fff',
      color: '#000',
      borderColor: '#fff'
    }).attr('selected', false);
    
    if (playasVal === playAs) {
      playAs = undefined;
      return;
    }
    
    if (playasVal === 'playas-x') {
      $(e.target).css({
        backgroundColor: constants.x_color,
        color: '#fff',
        borderColor: constants.x_color
      }).attr('selected', true);
    } else if (playasVal === 'playas-o') {
      $(e.target).css({
        backgroundColor: constants.o_color,
        color: '#fff',
        borderColor: constants.o_color
      }).attr('selected', true);
    } else {
      $(e.target).css({
        backgroundColor: constants.tie_color,
        color: '#fff',
        borderColor: constants.tie_color
      }).attr('selected', true);
    }
    
    playAs = playasVal;
  });
  
  $('#startgame').on('click', () => {
    if (!(gameMode && playAs) || gameStarted) return;
    gameStarted = true;
    setTimeout(() => {
      $('#title-screen').stop(true, false).animate({
        height: 'toggle',
        opacity: 'toggle'
      }, 900, () => {
        startGame();
        gameStarted = false;
      });
    }, 250);
  });
});
