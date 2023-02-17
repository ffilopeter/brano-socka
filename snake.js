// Inicializacia premennych a HTML5 canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Herne pole je rozdelene do "buniek" 10x10 px
// had sa pohybuje po bunkach (po 10px)
const cellSize = 10;

// Pocet buniek v riadku a v stlpci
const numRows = canvas.height / cellSize;
const numCols = canvas.width / cellSize;

// Hracove score
let score = 0;

/**
 * Pole, ktore predstavuje samotneho hada
 * pole sa sklada z objektov, ktore prestavuju kazdy "kusok" hada
 * objekt drzi hodnoty x,y coz su suradnice kazdeho "kúska" hada
 * 
 * Inicializacia hlavy hada na suradniciach (5,5)
 */
let snake = [{x: 5, y: 5}];

// Smer, ktorym had ide
let direction = "right";

// Jedlo - objekt so suradnicami x,y (random hodnoty)
// tento objekt je generovany funkciou generateFood 
let food = generateFood();

// Referencia na setInterval
// na manipulaciu s gameLoopom (clearInterval, setInterval,...)
let gameLoopInterval;

// BOOLEAN hodnota / hodnoty (true / false)
// ci je hra pauznutá alebo nie
let isPaused = false;

// index vybratej polozky v menu
let menuIndex = 0;

// Polozky v menu
const menuOptions = ["Resume Game", "Restart Game"];

// Eventy na klavesnici
document.addEventListener("keydown", function(event) {

    /**
     * Ked hrac stlaci ESC na klavesnici
     * hra sa pozastavi a zobrazi sa menu
     */
    if (event.key === "Escape") {
        togglePause();
    } else if (!isPaused) {
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
    } else if (event.key === "ArrowUp") {
        menuIndex = (menuIndex - 1 + menuOptions.length) % menuOptions.length;
        drawMenu();
    } else if (event.key === "ArrowDown") {
        menuIndex = (menuIndex + 1) % menuOptions.length;
        drawMenu();
    } else if (event.key === "Enter") {
        // Vybrata polozka v menu sa uklada do premennej menuIndex
        // a po stlaceni Enter sa zavola funkcia handleMenuSelect
        // ktora vykona potrebnu funkciu
        handleMenuSelect();
    }
});

// Zacat game loop - intervalom riadeny gameloop
// kazdych 100 ms sa zavola funkcia gameLoop
gameLoopInterval = setInterval(gameLoop, 100);

function gameLoop() {

    // Pohyb hada
    const head = {x: snake[0].x, y: snake[0].y};
    switch (direction) {
        case "up":
            head.y -= 1;
            break;
        case "down":
            head.y += 1;
            break;
        case "left":
            head.x -= 1;
            break;
        case "right":
            head.x += 1;
            break;
    }
    snake.unshift(head);

    // Kontrola kolizie hlavy hada s jedlom
    // ak ma hlava hada rovnake suradnice ako jedlo
    // score sa zvysi a vygeneruje sa nove jedlo
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        food = generateFood();
    } else {
        snake.pop();
    }

    // Kontrola kolizie hlavy hada so stenami
    if (head.x < 0 || head.x >= numCols || head.y < 0 || head.y >= numRows) {
        gameOver();
        return;
    }

    // Kontrola kolizie hlavy hada s hadom samotnym
    // ak had kusne sám seba
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver();
            return;
        }
    }

    /**
     * Vykreslit hru na canvas
     * 
     * canvas sa vycisti
     * vykresli sa hracove score
     * vykresli sa had
     * vykresli sa jedlo
     */
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawScore();
    drawSnake();
    drawFood();
}

// Vykresli score hráča na canvas
function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Score: " + (score / 10), 10, 20);
}

// Vykresli hada na canvas
function drawSnake() {
    for (let i = 0; i < snake.length; i++) {
        if (i === 0) {
            ctx.fillStyle = "#fabb33";
        } else {
            ctx.fillStyle = "#fbc756";
        }
        ctx.fillRect(snake[i].x * cellSize, snake[i].y * cellSize, cellSize, cellSize);
    }
}

// Vykresli jedlo na canvas
function drawFood() {
    ctx.fillStyle = "red";
    ctx.fillRect(food.x * cellSize, food.y * cellSize, cellSize, cellSize);
}

// Vygeneruje novy objekt s random suradnicami (x, y)
// ktory predstavuje jedlo
function generateFood() {
    let food;
    do {
        food = {
        x: Math.floor(Math.random() * numCols),
        y: Math.floor(Math.random() * numRows)
        };
    } while (isOnSnake(food));
    return food;
}

// Skontroluje poziciu (parameter funkcie position)
// ci je niekde "na hadovi"
function isOnSnake(position) {
    for (let i = 0; i < snake.length; i++) {
        if (position.x === snake[i].x && position.y === snake[i].y) {
            return true;
        }
    }
    return false;
}

// GameOver funkcia
// zrusi game loop
// vyhodi v prehliadaci ALERT
// a po zatvoreni alertu sa hra restartuje
function gameOver() {
    clearInterval(gameLoopInterval);
    alert("Game over! Your score is " + (score / 10));
    resetGame();
}

// Reset a restart hry
// resetuje hodnoty na povodne
// vytvori novy game loop
function resetGame() {
    score = 0;
    snake = [{x: 5, y: 5}];
    direction = "right";
    food = generateFood();
    clearInterval(gameLoopInterval);
    gameLoopInterval = setInterval(gameLoop, 100);
}

// Prepinanie hry medzi stavom paused
function togglePause() {
    isPaused = !isPaused;
    if (isPaused) {
        // Ak je hra pauznutá, vypne sa game loop 
        // a vykresli sa menu
        clearInterval(gameLoopInterval);
        drawMenu();
    } else {
        // Ked sa hra znovu spusti
        // vycisti sa canvas
        // znovu sa vytvori game loop
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.textAlign = "start";
        gameLoopInterval = setInterval(gameLoop, 100);
    }
}

// Vykresli menu na canvas
function drawMenu() {
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = "24px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText("PAUSED", canvas.width / 2, canvas.height / 3);
    for (let i = 0; i < menuOptions.length; i++) {
        ctx.font = "16px Arial";
        if (i === menuIndex) {
        ctx.fillStyle = "blue";
        } else {
        ctx.fillStyle = "black";
        }
        ctx.fillText(menuOptions[i], canvas.width / 2, canvas.height / 2 + i * 20);
    }
}

// Funkcia je zavolana v menu po stlaceni ENTER klavesy (vyberom polozky v menu)
// vybrana polozka v menu je ulozena v premennej menuIndex
// zavola sa prislusna funkcia k danej polozke menu
function handleMenuSelect() {
    switch (menuIndex) {
        case 0:
        togglePause();
        break;
        case 1:
        resetGame();
        togglePause();
        break;
    }
}