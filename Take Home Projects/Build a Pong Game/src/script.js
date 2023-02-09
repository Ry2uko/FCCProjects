// Hacked by Ry2uko :p
console.clear();

const PADDLE_SPEED = 10; // player
const BALL_SPEED = 6;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 100;

$(document).ready(function(){
  let playerScore= 0, 
      computerScore = 0;
  
  // Canvas setup
  const canvas = $('#canvas')[0];
  const ctx = canvas.getContext('2d');

  canvas.width = innerWidth;
  canvas.height = innerHeight;
  
  // position score
  $('.computer-score').css('right', canvas.width/4-72); // 4.5rem (font-size) = 72px
  $('.player-score').css('left', canvas.width/4-72); 
  
  
  // Draw paddles
  class Paddle {
    constructor({ position }) {
      this.position = position;
      this.velocity = {
        x: 0, 
        y: 0
      }
      this.width = PADDLE_WIDTH;
      this.height = PADDLE_HEIGHT;
    }

    draw() {
      ctx.fillStyle = '#D1D1D1';
      ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
    
    update() {
      this.draw()
      // Restrict paddle to boundaries
      if (
        this.position.y + this.velocity.y > 0 && 
        this.position.y + this.height + 
          this.velocity.y < canvas.height
      ) this.position.y += this.velocity.y;
    }
  }
  
  const paddle1 = new Paddle({ 
    position: {
      x: 10,
      y: (canvas.height/2)-(PADDLE_HEIGHT/2) // center
    }
  });
  
  // computer
  const paddle2 = new Paddle({
    position: {
      x: canvas.width - (PADDLE_WIDTH+10),
      y: (canvas.height/2)-(PADDLE_HEIGHT/2) // center
    }
  });

  paddle1.draw();
  paddle2.draw();
  
  // Create a ball
  class Ball {
    constructor({ position }) {
      this.position = position;
       
      this.velocity = {
        x: 0,  
        y: 0 
      }
      
      this.width = 12;
      this.height = 12;
    }
    
    draw() {
      ctx.fillStyle = '#D1D1D1';
      ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
    
    update() {
      this.draw();
      
      // Ball and paddle collision
      const rightSide = this.position.x + this.width + this.velocity.x;
      const leftSide = this.position.x + this.velocity.x;
      const bottomSide = this.position.y + this.height;
      const topSide = this.position.y;      
      
      // paddle 1 collision
      if (
        leftSide <= paddle1.position.x + paddle1.width &&
        bottomSide >= paddle1.position.y &&
        topSide <= paddle1.position.y + paddle1.height  
      ) {
        this.velocity.x = -this.velocity.x;
      }
      
      // paddle 2 collision
      if (
        rightSide >= paddle2.position.x &&
        bottomSide >= paddle2.position.y &&
        topSide <= paddle2.position.y + paddle2.height  
      ) {
        this.velocity.x = -this.velocity.x;
      }
      
      // reverse y directions
      if (
        this.position.y + this.height + this.velocity.y >= canvas.height ||
        this.position.y + this.velocity.y <= 0
      ) {
        this.velocity.y = -this.velocity.y;
      }
      
      // if ball hit left & right boundary
      if (rightSide >= canvas.width || leftSide <= 0) {
        const formatScore = score => {
          let formattedScore = '';
          if (score < 10) {
            formattedScore = `0${score}`;
          } else if (score > 99) {
            formattedScore = '99';
          } else {
            formattedScore = score.toString();
          }
          
          return formattedScore;
        }
        
        if (rightSide >= canvas.width) { // right boundary (player score)
          // if player actually manages to scorelol
          playerScore++;
          $('.player-score').text(formatScore(playerScore));
        } else { // left boundary (computer score)
          computerScore++;
          $('.computer-score').text(formatScore(computerScore));
        }
        
        // reset 
        this.velocity = {
          x: 0,
          y: 0
        };
        
        this.position =  {
          x: canvas.width/2,
          y: canvas.height/2
        };
        
      }
      
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
    }
    
    startGame() {
      // Randomized ball movement
      this.velocity = {
        x: Math.random() - 0.5 >= 0 ? -BALL_SPEED : BALL_SPEED,
        y: Math.random() - 0.5 >= 0 ? -BALL_SPEED : BALL_SPEED
      };
    }
  }
  
  const ball = new Ball({ 
    position: {
      x: canvas.width/2,
      y: canvas.height/2
    }                      
  });
  
  // Respond to user input
  
  function animate() {
    requestAnimationFrame(animate);
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    paddle1.update();
    paddle2.update();
    
    // Draw lines
    ctx.beginPath();
    ctx.setLineDash([16, 16])
    ctx.lineWidth = 12;
    ctx.strokeStyle = 'rgba(209, 209, 209, 0.8)';
    ctx.moveTo((canvas.width/2)+12, 0);
    ctx.lineTo(canvas.width/2, canvas.height);
    ctx.stroke();
    
    ball.update();

    // paddle 2 follows ball velocity
    if ( // if ball is in the center and not moving
      (ball.velocity.x === 0 && ball.velocity.y === 0) &&
      (ball.position.x === canvas.width/2 && ball.position.y === canvas.height/2)
    ) {
      console.log(paddle2.position.y+PADDLE_HEIGHT/2, canvas.height/2);
      if (paddle2.position.y+PADDLE_HEIGHT/2 < canvas.height/2) {
        paddle2.velocity.y = BALL_SPEED;
      } else if (paddle2.position.y+PADDLE_HEIGHT/2 > canvas.height/2) {
        paddle2.velocity.y = -BALL_SPEED;
      } else {
        paddle2.velocity.y = 0;
        
        // wait for paddle to arrive at center
        setTimeout(() => { 
          if (ball.velocity.x !== 0 && ball.velocity.y !== 0) return;
          ball.startGame(); 
        }, 500);
      }
    } else {
      if (ball.velocity.y > 0) paddle2.velocity.y = BALL_SPEED;
      else paddle2.velocity.y = -BALL_SPEED;
    }
  }
  
  animate();
  
  $(window).on({
    'keydown': e => {
      switch(e.key) {
        case 'ArrowUp':
          paddle1.velocity.y = -PADDLE_SPEED;
          break;
        case 'ArrowDown':
          paddle1.velocity.y = PADDLE_SPEED;
          break;
      }
    },
  });

});