// Hacked by Ry2uko :p

// Start here, goodluck!


/* Game constants */

// experience points and levels
const POINTS_PER_LEVEL = 100;

// map dimensions
const COLS = 70;
const ROWS = 50;
const TILE_DIM = 13;

// tile codes and colors
const WALL_CODE = 0;
const FLOOR_CODE = 1;
const PLAYER_CODE = 2;
const ENEMY_CODE = 3;
const POTION_CODE = 4;
const WEAPON_CODE = 5;

const TILE_COLORS = [
  'grey',   // wall
  'white',  // floor
  'blue',   // player
  'red',    // enemy
  'green',  // health potion
  'orange'  // weapon
];

/*
 * for the shadow 2d array
*/
const SHADOW_CODE = 0,
      VISIBLE_CODE = 1;

// quantities
let TOTAL_ENEMIES = 5;
let STARTING_POTIONS_AMOUNT = 8;
let STARTING_WEAPONS_AMOUNT = 3;

/*
 * helper arrays for randomly choosing properties of enemies
*/
let ENEMIES_HEALTH = [30, 30, 30, 30, 30, 30, 40, 40, 40, 60, 80];
let ENEMIES_DAMAGE = [30, 30, 30, 30, 30, 40, 40, 40, 60, 80];
let POTIONS = [10, 20, 20, 20, 20, 30, 40, 40, 50, 100];

// weapons
let WEAPONS = [
  {
    name: 'Dagger',
    damage: 20
  },
  {
    name: 'Sword',
    damage: 40
  },
  {
    name: 'Hammer',
    damage: 60
  },
  {
    name: 'Axe',
    damage: 100
  }
];

/*
 * specifies how many tiles should be visible in each  direction
*/
const VISIBILITY = 3; // ex.3 = 7x7 square (including the center tile)

/* Classes */
class Player {
  constructor(level, health, weapon, coords, xp) {
    this.level = level;
    this.health = health;
    this.weapon = weapon;
    this.coords = coords;
    this.xp = xp;
  }
}

class Enemy {
  constructor(health, coords, damage) {
    this.health = health;
    this.coords = coords;
    this.damage = damage;
  }
}

class Game {
  constructor() {
    /*
        The map 2d array will store integer map codes
      */
    this.map = [];
    this.shadow = [];
    this.isShadowToggled = true;
    this.enemies = [];
    this.canvas = null;
    this.context = null;
  }

  // reset game
  reset() {
    this.enemies = [];
    this.map = [];  
    this.shadow = [];
  }
}

$(document).ready(function(){
  
  /* Setup */
  
  function createDOM() {
    const container = $('#root');
    
    // populating the hud
    let hud = document.createElement('ul');
    hud.id = 'hud';
    
    const labels = [
      'XP',
      'Level',
      'Health',
      'Weapon',
      'Damage', 
      'Enemies'
    ];
    
    for (let label of labels) {
      hud = addStat(label, hud);
    }
    
    container.append(hud);
    
    // adding the game map
    const canvas = document.createElement('canvas');
    canvas.id = 'grid';
    canvas.height = ROWS * TILE_DIM;
    canvas.width = COLS * TILE_DIM;
    
    container.append(canvas);
    
  }
  
  
  function addStat(label, container) {
    const el = document.createElement('li');
    const id = label.toLowerCase();
    
    el.innerHTML += `
      <label>${label}:</label> <span id="${id}"></span>
    `;
    
    container.appendChild(el); 
    return container;
  }
  
  
  /* Initialize Game */
  
  let game = null;
  let player = null;
  
  function init() {
    createDOM();
    
    game = new Game();
    game.canvas = $('#grid')[0];
    game.context = game.canvas.getContext('2d');
    
    startGame();
    
    addKeyboardListener();
  }
  
  init();
  
  
  /* Start Game */
  
  function startGame(type) {
    generateMap();
    
    if (type === 'boss') {
     TOTAL_ENEMIES = 1;
     STARTING_POTIONS_AMOUNT = 5;
     ENEMIES_HEALTH = [500, 500, 500, 500, 500];
      
     STARTING_WEAPONS_AMOUNT = 0;
     ENEMIES_DAMAGE = [100, 100, 100, 100, 100];
     POTIONS = [50, 50, 50, 50, 50, 50, 50, 100];
     TILE_COLORS[ENEMY_CODE] = '#C5037D';
    }
    
    setTimeout(gameSetUp, 1000);
    
    function gameSetUp() {
      if (type !== 'boss') {
        generatePlayer();
      } else {
        let coords = generateValidCoords();
    
        player = new Player(player.level, player.health, player.weapon, coords, player.xp);

        // add player to map
        addObjToMap(player.coords, PLAYER_CODE);
      }
      generateShadow();
      
      // don't generate weapons if max weapon is already acquired
      if (WEAPONS[WEAPONS.length-1].name !== player.weapon.name) generateItems(STARTING_WEAPONS_AMOUNT, WEAPON_CODE);
      
      generateItems(STARTING_POTIONS_AMOUNT, POTION_CODE);
      generateEnemies(TOTAL_ENEMIES);
      drawMap(0, 0, COLS, ROWS);
      updateStats();
    }
  }
  
  
  /* Generate map */
  // generate map using random walk algorithm
  function generateMap() {
    for (let row = 0; row < ROWS; row++) {
      // create row
      game.map.push([]);  
      
      for (let col = 0; col < COLS; col++) {
        // add wall tile to row
        game.map[row].push(WALL_CODE);
      }
    }
    
    /* Start algorithm */
    
    // place digger at the center
    let pos = {
      x: COLS/2,
      y: ROWS/2
    };
    
    // maximum number of attempts we can make at a dig
    const ATTEMPTS = 30000; 
    // minimum number of floor tiles the gameboard needs
    const MINIMUM_TILES_COUNT = 1000;
    // maximum number of outer limit penalties before the dig attempt fails
    const MAX_PENALTIES_COUNT = 1000;
    // tiles between each floor tile and the edge of the map
    const OUTER_LIMIT = 3; 
    
    /* Begin the Digging */
    
    const randomDirection = () => Math.random() <= 0.5 ? -1 : 1;
    let tiles = 0, penalties = 0;
    
    for (let i = 0; i < ATTEMPTS; i++) {
      let axis = Math.random() <= 0.5 ? 'x' : 'y';
      
      /*
       * get the number of rows or columns, depending on the axis.
       */
      let numCells = axis == 'x' ? COLS : ROWS;
      
      pos[axis] += randomDirection();
      
      // while out of bounds
      while (pos[axis] < OUTER_LIMIT || pos[axis] >= numCells - OUTER_LIMIT) {
        /* 
         * search for new tile
         * if cannot find one, quit or start from the center
         */ 
        pos[axis] += randomDirection();
        penalties++;
        
        /*
         * if penalty limit is reached, 
         * and if we've used the minimum number of floor tiles
         * finish building the map else return to center
         */
        if (penalties > MAX_PENALTIES_COUNT) {
          if (tiles >= MINIMUM_TILES_COUNT) {
              return;
          }
          
          pos.x = COLS / 2;
          pos.y = ROWS / 2;
        }
      }
      
      let {x, y} = pos;
      
      /* 
       * add a floor tile at the new position if one does not exist
       */
      if (game.map[y][x] != FLOOR_CODE) {
        game.map[y][x] = FLOOR_CODE;
        tiles++;
      }
      
      penalties = 0; // reset penalties every new attempt
    }
    
  }
  
  
  /* Render map */
  
  // draw one square on the map
  function drawObject(x, y, color) {
    game.context.beginPath();
    game.context.rect(x * TILE_DIM, y * TILE_DIM, TILE_DIM, TILE_DIM);
    game.context.fillStyle = color;
    game.context.fill();
  }
  
  // render 2d map
  function drawMap(startX, startY, endX, endY) {
    for (let row = startY; row < endY; row++) {
      for (let col = startX; col < endX; col++) {
        let color = null;
        
        if (game.isShadowToggled && game.shadow[row][col] == SHADOW_CODE) {
          color = '#000';
        } else {
          let c_idx = game.map[row][col];
          color = TILE_COLORS[c_idx];
        }
        
        drawObject(col, row, color);
      }
    }
  }
  
  
  /* Generating game elements */
  
  // adds a new tile at a specific location
  function addObjToMap(coords, tileCode) {
    game.map[coords.y][coords.x] = tileCode;
  }
  
  // generate valid coordinates
  function generateValidCoords() {
    let x, y;
    
    do {
      x = Math.floor(Math.random() * COLS);
      y = Math.floor(Math.random() * ROWS);
    } 
    while (game.map[y][x] != FLOOR_CODE);
    
    return { x, y };
  }
  
  // pick random value from array
  function pickRandom(arr) {
    let idx = Math.floor(Math.random() * arr.length);
    return arr[idx];
  }
  
  // generate player
  function generatePlayer() {
    let coords = generateValidCoords();
    
    player = new Player(1, 150, WEAPONS[0], coords, 30);
    
    // add player to map
    addObjToMap(player.coords, PLAYER_CODE);
  }
  
  // generate enemies
  function generateEnemies(amount) {
    for (let i = 0; i < amount; i++) {
      let coords = generateValidCoords();
      let health = pickRandom(ENEMIES_HEALTH);
      let damage = pickRandom(ENEMIES_DAMAGE);
      
      let enemy = new Enemy(health, coords, damage);
      game.enemies.push(enemy);
      
      addObjToMap(coords, ENEMY_CODE);
    }
  }
  
  // generate potions and weapons
  function generateItems(quantity, tileCode) {
    for (let i = 0; i < quantity; i++) {
      let coords = generateValidCoords();
      addObjToMap(coords, tileCode);
      
      // draw only if shadow is disabled and visible 
      if (!game.isShadowToggled || game.shadow[coords.y][coords.x] == VISIBLE_CODE) {
        let color = TILE_COLORS[tileCode];
        drawObject(coords.x, coords.y, color); 
      }
    }
  }
  
  
  /* Player movement */
  
  // removes an object and replaces it with a floor tile
  function removeObjFromMap(x, y) {
    game.map[y][x] = FLOOR_CODE;
  }
  
  // updates player's position
  function updatePlayerPosition(oldX, oldY, newX, newY) {
    removeObjFromMap(oldX, oldY);
    
    game.map[newY][newX] = PLAYER_CODE;
    
    player.coords = {
      x: newX, 
      y: newY
    };
    
    let start = {}, end = {};
    
    // if player is going right and down
    let old_left = oldX - VISIBILITY;
    let old_top = oldY - VISIBILITY;
    
    start.x = old_left < 0 ? 0 : old_left;
    start.y = old_top < 0 ? 0 : old_top;
    
    let new_right = newX + VISIBILITY;
    let new_bot = newY + VISIBILITY;
    
    
    end.x = new_right >= COLS ? COLS - 1 : new_right;
    end.y = new_bot >= ROWS ? ROWS - 1 : new_bot;
    
    // if player is moving left
    if (oldX > newX) {
      start.x = newX - VISIBILITY;
      end.x = oldX + VISIBILITY;
    }
    
    // if player is moving up
    if (oldY > newY) {
      start.y = newY - VISIBILITY;
      end.y = oldY + VISIBILITY;
    }
    
    
    for (let row = start.y; row <= end.y; row++) {
      for (let col = start.x; col <= end.x; col++) {
        if (
          row >= newY - VISIBILITY &&
          row <= newY + VISIBILITY &&
          col >= newX - VISIBILITY &&
          col <= newX + VISIBILITY
        ) {
          game.shadow[row][col] = VISIBLE_CODE;
        } else {
          game.shadow[row][col] = SHADOW_CODE;
        }
      } 
    }
  }
  
  // object for detecting if player is holding key
  window.keypressed = {};
  
  // add listener for control
  function addKeyboardListener() {
    $(window).on('keydown', function(e){
      if (window.keypressed[e.key]) return; // if player is holding key
      window.keypressed[e.key] = true;
      
      let x = player.coords.x,
          y = player.coords.y;
      let oldX = player.coords.x,
          oldY = player.coords.y;

      switch (e.key) {
        case 'ArrowUp':
          y--;
          break;
          
        case 'ArrowDown':
          y++;
          break;
          
        case 'ArrowLeft':
          x--;
          break;
          
        case 'ArrowRight':
          x++;
          break;
          
        default: 
          return;
      }
      
      /* Enemy collision */
      if (game.map[y][x] == ENEMY_CODE) {
        // find the enemy with matching coords 
        const matching_coords = enemy => {
          return enemy.coords.x == x && enemy.coords.y == y;
        }
        
        let enemy = game.enemies.find(matching_coords);
        
        fightEnemy(enemy);
      }
      
      // wall collision
      else if (game.map[y][x] != WALL_CODE) {
        
        /* Potion collision */
        if (game.map[y][x] == POTION_CODE) {
          player.health += pickRandom(POTIONS);

          removeObjFromMap(x, y);

          // regenerate potion
          generateItems(1, POTION_CODE);
        } 
        
        /* Weapon collision */
        else if (game.map[y][x] == WEAPON_CODE) {
          // upgrade weapon & not if max
          for (let i = 0; i < WEAPONS.length-1; i++) {
            if (player.weapon.name === WEAPONS[i].name) {
              player.weapon = WEAPONS[i+1];
              break;
            }
          }
          
          removeObjFromMap(x, y);
        }
        
        updatePlayerPosition(player.coords.x, player.coords.y, x, y);
        
        updateStats();
        
        // redraw the visible part of the map around the player
        let left = oldX - VISIBILITY - 1;
        let top = oldY - VISIBILITY - 1;
        let right = x + VISIBILITY + 2;
        let bottom = y + VISIBILITY + 2;
        
        drawMap(left, top, right, bottom);
      }
      
      e.preventDefault(); // prevent the default action (scroll / move caret)
    });
    $(window).on('keyup', function(e){
      window.keypressed[e.key] = false;
    })
  }
  
  
  /* Updating game stats */
  
  // update stats
  function updateStats() {
    let player_props = ['xp', 'level', 'health'];
    
    // print properties to hud
    for (let prop of player_props) {
      let el = $(`#${prop}`);
      
      el.text(player[prop]);
    }
    
    // mapping object that matches the HUD element's ID to the weapon's object key of name
    let weapon_props = [
      {
        domId: 'weapon',
        key:  'name'
      },
      {
        domId: 'damage',
        key: 'damage'
      }
    ];
    
    // iterate weapon properties
    for (let prop of weapon_props) {
      let {domId, key} = prop;
      let el = $(`#${domId}`);
      
      el.text(player.weapon[key]);
    }
    
    // update enemy stats
    let enemyStats = $('#enemies');
    enemyStats.text(game.enemies.length);
  }
  
  
  /* Enemy combat */
  
  // game over 
  function gameOver() {
    alert("GAME OVER");
    game.reset();
    startGame();
  }
  
  // when fighting an enemy
  function fightEnemy(enemy) {
    // if player dies
    if (player.health - enemy.damage <= 0) {
      gameOver();
      return;
    }
    
    // if player manages to beat the sht out of the enemy
    if (enemy.health - player.weapon.damage <= 0) {
      enemyDefeated(enemy);
    } 
    // if enemy survives :o
    else { 
      enemy.health -= player.weapon.damage; 
    }
    
    player.health -= enemy.damage;
    updateStats();
  }
  
  
  /* Handling a defeated enemy */
  
  // if enemy is defeated
  function enemyDefeated(enemy) {
    // remove enemy from existence
    removeObjFromMap(enemy.coords.x, enemy.coords.y); 
    
    // redraw
    let left = enemy.coords.x - 1;
    let top = enemy.coords.y - 1;
    let right = enemy.coords.x + 1;
    let bottom = enemy.coords.y + 1;
    
    drawMap(left, top, right, bottom);
    
    // augment player exp
    player.xp += parseInt((enemy.damage + enemy.health) / 2);
    
    let level_in_points = POINTS_PER_LEVEL * (player.level - 1);
    
    // if player will level up
    if (player.xp - level_in_points >= POINTS_PER_LEVEL) {
      player.level++;
      player.health += 100;
      player.damage += 5;
    }
    
    // remove enemy from game.enemies and update HUD
    let e_idx = game.enemies.indexOf(enemy);
    game.enemies.splice(e_idx, 1);
    
    updateStats();
    
    if (game.enemies.length == 0) {
      userWins();
    }
  }
  
  /* Shadow logic */
  
  // generate spooky dark shadow
  function generateShadow() {
    let start = {}, end = {};
    
    // calculate the location of the visible square’s edges.
    let left_edge = player.coords.x - VISIBILITY;
    start.x = left_edge < 0 ? 0 : left_edge;
    
    let top_edge = player.coords.y - VISIBILITY;
    start.y  = top_edge < 0 ? 0 : top_edge;
    
    let right_edge = player.coords.x + VISIBILITY;
    end.x = right_edge >= COLS ? COLS - 1 : right_edge;
    
    let bottom_edge = player.coords.y + VISIBILITY;
    end.y  = bottom_edge >= ROWS ? ROWS - 1 : bottom_edge;
    
    // populate array based on the visible rectangle's new corners
    for (let row = 0; row <= ROWS; row++) {
      game.shadow.push([]);
      
      for (let col = 0; col <= COLS; col++) {
        // if visible
        if (
          row >= start.y && 
          row <= end.y &&
          col >= start.x &&
          col <= end.x
        ) {
          game.shadow[row].push(VISIBLE_CODE);
        } else {
          game.shadow[row].push(SHADOW_CODE);
        }
      }
    }
  }
  
  
  /* Boss Battle */
  function userWins() {
    if (TILE_COLORS[ENEMY_CODE] === '#C5037D') {
      alert('YOU CONQUERED THE DUNGEON!')
      game.reset();
      startGame();
    } else {
      alert('DUNGEON CLEARED!');
      game.reset();
      startGame('boss');  
    }
    
  }
});