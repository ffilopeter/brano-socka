// Define canvas and context variables
var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

// Define variables for game state
var gridSize = 20;
var snake = [{x: 5, y: 5}];
var food = {x: 15, y: 15};
var direction = "right";
var score = 0;

// Set up event listener for arrow keys
document.addEventListener("keydown", function(event) {
    if (event.key === "ArrowUp" && direction !== "down") {
        direction = "up";
    } else if (event.key === "ArrowDown" && direction !== "up") {
        direction = "down";
    } else if (event.key === "ArrowLeft" && direction !== "right") {
        direction = "left";
    } else if (event.key === "ArrowRight" && direction !== "left") {
        direction = "right";
    }
});

// Define function to draw a square on the canvas
function drawSquare(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
}

// Define function to move the snake
function moveSnake() {
    // Determine the new head position
    var head = {x: snake[0].x, y: snake[0].y};
    if (direction === "up") {
        head.y--;
    } else if (direction === "down") {
        head.y++;
    } else if (direction === "left") {
        head.x--;
    } else if (direction === "right") {
        head.x++;
    }
    // Handle the snake hitting the walls
    if (head.x < 0) {
        head.x = canvas.width / gridSize - 1;
    } else if (head.x >= canvas.width / gridSize) {
        head.x = 0;
    } else if (head.y < 0) {
        head.y = canvas.height / gridSize - 1;
    } else if (head.y >= canvas.height / gridSize) {
        head.y = 0;
    }
    // Add the new head to the snake array
    snake.unshift(head);
    // Handle the snake eating the food
    if (head.x === food.x && head.y === food.y) {
        score++;
        generateFood();
    } else {
        snake.pop();
    }
}

// Define function to generate a new piece of food
function generateFood() {
    food.x = Math.floor(Math.random() * canvas.width / gridSize);
    food.y = Math.floor(Math.random() * canvas.height / gridSize);
}

// Define function to check for collision between the snake and its own body
function checkCollision() {
    for (var i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    return false;
}

// Define function to draw the game on the canvas
function drawGame() {
    // Move the snake
    moveSnake();
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the snake
    for (var i = 0; i < snake.length; i++) {
    drawSquare(snake[i].x, snake[i].y, "green");
    }
    
    // Draw the food
    drawSquare(food.x, food.y, "red");
    
    // Draw the score
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 30);
    
    // Check for collision
    if (checkCollision()) {
        clearInterval(gameInterval);
        alert("Game over!");
    }
}

// Generate the initial piece of food
generateFood();

// Start the game loop
var gameInterval = setInterval(drawGame, 100);