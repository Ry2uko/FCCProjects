// Hacked by Ry2uko :P
console.clear();

const SIZE = 40,
      CANVAS_WIDTH = 800,
      CANVAS_HEIGHT = 600;

let cols = 0, 
    rows = 0, 
    board = [],
    nextBoard = [];

const COLOR_BG = [0, 0, 0],
      COLOR_ALIVE = [255, 214, 10];

let RUNNING = false,
    GENERATIONS = 0;

// clear board 
function clearBoard() {
  // Generate 2D array with zeros
  board = new Array(cols).fill(0);
  for (let i = 0; i < board.length; i++) {
    board[i] = new Array(rows).fill(0);
  }
  
  nextBoard = new Array(cols).fill(0);
  for (let i = 0; i < nextBoard.length; i++) {
    nextBoard[i] = new Array(rows).fill(0);
  }
  GENERATIONS = 0;
  document.getElementById('generations').innerText = GENERATIONS;
}

// fill board randomly
function generateBoard() {
  clearBoard();
   
  for (let i = 0; i < cols; i++) { // row
    for (let j = 0; j < rows; j++) { // col
      board[i][j] = Math.floor(Math.random() * 2);
      nextBoard[i][j] = 0;
    }
  }
}

// new generation
function generate() {
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      let neighbors = 0;
      
      // get surrounding 3x3 alive neighbors
      for (let i = -1 ; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          // if index not out of range
          if (!((x+i <= -1 || x+i >= cols) || (y+j <= -1 || y+j >= rows))) {
              neighbors += board[x+i][y+j];
          }
        }
      }
      
      neighbors -= board[x][y]; // subtract current cell's state
      
      // Rules of Life
      if ((board[x][y] == 1) && (neighbors < 2)) nextBoard[x][y] = 0; // underpopulation
      else if ((board[x][y] == 1) && (neighbors > 3)) nextBoard[x][y] = 0; // overpopulation
      else if ((board[x][y] == 0) && (neighbors == 3)) nextBoard[x][y] = 1; // reproduction
      else nextBoard[x][y] = board[x][y] // stasis
    }
  }
  
  GENERATIONS++;
  let temp = board;
  board = nextBoard;
  nextBoard = temp;
  document.getElementById('generations').innerText = GENERATIONS;
}

const sketch = function(p) {
  p.setup = function(){
    p.frameRate(10);
    p.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);

    // Calculate columns nd rows
    cols = p.floor(p.width / SIZE), 
    rows = p.floor(p.height / SIZE);
    
    generateBoard();
  };
  
  p.draw = function(){
    p.background(...COLOR_BG);
    
    if (RUNNING) generate();
    
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        if (board[i][j]) p.fill(...COLOR_ALIVE);
        else p.fill(...COLOR_BG);
        p.stroke(`rgba(255, 255, 0, 0.2)`);
        p.rect(i*SIZE, j*SIZE, SIZE-1, SIZE-1);
      }
    }
  }
  
  p.mousePressed = function(){
    // if cursor is in canvas
    if (!((p.mouseX < 0 || p.mouseX > CANVAS_WIDTH) || (p.mouseY < 0 || p.mouseY > CANVAS_HEIGHT))) {
      let x = p.round(p.mouseX), y = p.round(p.mouseY);
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          if (
            ((x >= (i*SIZE)+1) && (x <= (i*SIZE+SIZE)-1)) && 
            ((y >= (j*SIZE)+1) && (y <= (j*SIZE+SIZE)-1))
          ) { // get index of cursor in 2d array
            if (board[i][j] == 1) {
              board[i][j] = 0;
              p.fill(...COLOR_BG);
              p.stroke(`rgba(255, 255, 0, 0.2)`);
              p.rect(i*SIZE, j*SIZE, SIZE-1, SIZE-1);
            } else {
              board[i][j] = 1;
              p.fill(...COLOR_ALIVE);
              p.stroke(`rgba(255, 255, 0, 0.2)`);
              p.rect(i*SIZE, j*SIZE, SIZE-1, SIZE-1);
            }
            
          }
        }
      }
    }
  }
  
  p.keyPressed = function(){
   switch(p.key) {
     case ' ': // play / pause 
       RUNNING = !RUNNING; 
       break;
     
     case 'c': // clear 
       RUNNING = false;
       clearBoard();
       break;
     
     case 'r': // randomize board 
       RUNNING = false;
       generateBoard();
       break;
       
     default:
       return;
   }
  }
}

new p5(sketch, 'canvas-container');

