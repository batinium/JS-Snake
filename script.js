//HTML elements to bo used
const gameBoard = document.getElementById("game-board");
const instructionText = document.getElementById("instruction-text");
const logo = document.getElementById("logo");
const score = document.getElementById("score");
const highScoreText = document.getElementById("highScore");

//game variables
const gridSize = 20;
var snake = [{ x: 10, y: 10 }];
var food = generateFood();
var direction = "right"; //initial direction
var directionQueue = null; //next direction

var gameInterval;
var gameSpeedDelay = 200; //100ms
var gameStarted = false;
var highScore = 0;

var speedUp = generateSpeedUp();
var checkbox = document.getElementById("collisionCheckSetting");

var collisionCheckSetting = null;
checkbox.addEventListener("change", function () {
  collisionCheckSetting = checkbox.checked;
});

//draw the game board
function draw() {
  gameBoard.innerHTML = "";
  drawSnake();
  drawFood();
  drawSpeedUp();
  updateScore();
}

//draw the snake
function drawSnake() {
  //for each segment of the snake, create a div element and add it to the game board
  snake.forEach((segment) => {
    const snakeElement = createGameElement("div", "snake");
    setPosition(snakeElement, segment);
    gameBoard.appendChild(snakeElement);
  });
}

//create a snake or food cube/div
function createGameElement(tagName, className) {
  const element = document.createElement(tagName);
  element.className = className;
  return element;
}

//set the position of the snake or food cube/div
function setPosition(element, position) {
  element.style.gridColumn = position.x;
  element.style.gridRow = position.y;
}

//draw the food on the game board
function drawFood() {
  if (gameStarted) {
    const foodElement = createGameElement("div", "food");
    setPosition(foodElement, food);
    gameBoard.appendChild(foodElement);
  }
}
function drawSpeedUp() {
  if (gameStarted) {
    const speedUpElement = createGameElement("div", "speedUp");
    setPosition(speedUpElement, speedUp);
    gameBoard.appendChild(speedUpElement);
  }
}

function generateSpeedUp() {
  const x = Math.floor(Math.random() * gridSize + 1);
  const y = Math.floor(Math.random() * gridSize + 1);
  return { x, y };
}

//generate a random position for the food
function generateFood() {
  const x = Math.floor(Math.random() * gridSize + 1);
  const y = Math.floor(Math.random() * gridSize + 1);
  return { x, y };
}

//move the snake
function move() {
  const head = { ...snake[0] }; //spread operator is called to create a new object
  direction = directionQueue || direction; //if directionQueue is null, use the current direction
  directionQueue = null; //reset the directionQueue
  switch (direction) {
    case "right":
      head.x++;
      break;
    case "left":
      head.x--;
      break;
    case "up":
      head.y--;
      break;
    case "down":
      head.y++;
      break;
  }
  snake.unshift(head); //add head object to the beginning of the snake array

  if (head.x === food.x && head.y === food.y) {
    food = generateFood();
    changeGameSpeed(-10);
    setGameLoop();
  } else if (head.x === speedUp.x && head.y === speedUp.y) {
    speedUp = generateSpeedUp();
    changeGameSpeed(+5);
    setGameLoop();
    snake.pop(); //remove the last element of the snake array
  } else {
    snake.pop(); //remove the last element of the snake array
  }
}

function changeGameSpeed(delay) {
  if (gameSpeedDelay > 150) {
    gameSpeedDelay += delay;
  } else if (gameSpeedDelay > 100) {
    gameSpeedDelay += delay / 2;
  } else if (gameSpeedDelay > 50) {
    gameSpeedDelay += delay / 3;
  } else if (gameSpeedDelay > 25) {
    gameSpeedDelay += delay / 4;
  }
  console.log(gameSpeedDelay);
}

//Start game
function startGame() {
  gameStarted = true; //set game started to true
  logo.style.display = "none"; //hide the logo
  instructionText.style.display = "none"; //hide the instruction text
  setGameLoop(); //start the game loop
}

//keypress event listener
function handleKeyPress(event) {
  if (
    (!gameStarted && event.code === "Space") ||
    (!gameStarted && event.code === "")
  ) {
    startGame();
  }
  let newDirection = null;
  switch (event.key) {
    case "ArrowUp":
      if (direction !== "down") newDirection = "up";
      break;
    case "ArrowDown":
      if (direction !== "up") newDirection = "down";
      break;
    case "ArrowLeft":
      if (direction !== "right") newDirection = "left";
      break;
    case "ArrowRight":
      if (direction !== "left") newDirection = "right";
      break;
  }

  directionQueue = newDirection;
}

document.addEventListener("keydown", handleKeyPress);

function checkCollision() {
  const head = snake[0];
  if (collisionCheckSetting === null || collisionCheckSetting === false) {
    if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
      gameOver();
    }
  } else {
    if (head.x < 1) {
      head.x = 20;
    } else if (head.x > 20) {
      head.x = 1;
    }
    if (head.y < 1) {
      head.y = 20;
    } else if (head.y > 20) {
      head.y = 1;
    }
  }
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      gameOver();
    }
  }
  console.log(collisionCheckSetting);
}

//game over
function gameOver() {
  updateHighScore();
  stopGame();
  snake = [{ x: 10, y: 10 }];
  food = generateFood();
  speedUp = generateSpeedUp();
  direction = "right";
  gameSpeedDelay = 200;
  updateScore();
}

//update the score
function updateScore() {
  const currentScore = snake.length - 1; //get the current score
  //score.textContent = `Score: ${currentScore}`; //update the score
  score.textContent = currentScore.toString().padStart(3, "0"); //padstart adds 0 to the left of the score
}

function stopGame() {
  clearInterval(gameInterval);
  gameStarted = false;
  logo.style.display = "block";
  instructionText.style.display = "block";
}

//update the high score
function updateHighScore() {
  const currentScore = snake.length - 1;
  if (currentScore > highScore) {
    highScore = currentScore;
    highScoreText.textContent = currentScore.toString().padStart(3, "0");
  }
  highScoreText.style.display = "block";
}

function setGameLoop() {
  clearInterval(gameInterval);
  gameInterval = setInterval(() => {
    move(); //move the snake
    checkCollision(); //check for collision
    draw(); //draw the game board
  }, gameSpeedDelay);
}
