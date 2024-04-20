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
var direction = "right";
var gameInterval;
var gameSpeedDelay = 200; //100ms
var gameStarted = false;
var highScore = 0;

//draw the game board
function draw() {
  gameBoard.innerHTML = "";
  drawSnake();
  drawFood();
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

//generate a random position for the food
function generateFood() {
  const x = Math.floor(Math.random() * gridSize + 1);
  const y = Math.floor(Math.random() * gridSize + 1);
  return { x, y };
}

//move the snake
function move() {
  const head = { ...snake[0] }; //spread operator is called to create a new object
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
    increaseSpeed();
    clearInterval(gameInterval); //clear past interval
    gameInterval = setInterval(() => {
      move(); //move the snake
      checkCollision(); //check for collision
      draw(); //draw the game board
    }, gameSpeedDelay);
  } else {
    snake.pop(); //remove the last element of the snake array
  }
}

function increaseSpeed() {
  gameSpeedDelay -= 10;
  if (gameSpeedDelay > 150) {
    gameSpeedDelay -= 5;
  } else if (gameSpeedDelay > 100) {
    gameSpeedDelay -= 3;
  } else if (gameSpeedDelay > 50) {
    gameSpeedDelay -= 2;
  } else if (gameSpeedDelay > 25) {
    gameSpeedDelay -= 1;
  }
  console.log(gameSpeedDelay);
}

//Start game
function startGame() {
  gameStarted = true; //set game started to true
  logo.style.display = "none"; //hide the logo
  instructionText.style.display = "none"; //hide the instruction text
  gameInterval = setInterval(() => {
    move(); //move the snake
    checkCollision(); //check for collision
    draw(); //draw the game board
  }, gameSpeedDelay);
}

//keypress event listener
function handleKeyPress(event) {
  if (
    (!gameStarted && event.code === "Space") ||
    (!gameStarted && event.code === "")
  ) {
    startGame();
  }
  switch (event.key) {
    case "ArrowUp":
      if (direction !== "down") direction = "up";
      break;
    case "ArrowDown":
      if (direction !== "up") direction = "down";
      break;
    case "ArrowLeft":
      if (direction !== "right") direction = "left";
      break;
    case "ArrowRight":
      if (direction !== "left") direction = "right";
      break;
  }
}

document.addEventListener("keydown", handleKeyPress);

function checkCollision() {
  const head = snake[0];

  if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
    gameOver();
  }
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      gameOver();
    }
  }
}

//game over
function gameOver() {
  updateHighScore();
  stopGame();
  snake = [{ x: 10, y: 10 }];
  food = generateFood();
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
