const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20;
let snake = [{x: 8, y: 8}];
let food = {x: 10, y: 10};
let direction = {x: 1, y: 0};
let isPlaying = false;
let gameInterval;
let lives = 3;
let score = 0;
let levelSpeed = 100;

const pauseBtn = document.getElementById('pauseBtn');
const playBtn = document.getElementById('playBtn');
const resetBtn = document.getElementById('resetBtn');
const levelButtons = document.querySelectorAll('.levelBtn');
const livesDisplay = document.getElementById('lives');
const scoreDisplay = document.getElementById('score');

// Draw Snake
function drawSnake() {
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? '#27ae60' : '#2ecc71'; // Snake head in bright green
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
        if (index === 0) {
            ctx.fillStyle = 'white'; // Snake head eyes
            ctx.beginPath();
            ctx.arc(segment.x * gridSize + 5, segment.y * gridSize + 5, 3, 0, Math.PI * 2);
            ctx.arc(segment.x * gridSize + 15, segment.y * gridSize + 5, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = 'red'; // Snake tongue
            ctx.beginPath();
            ctx.moveTo(segment.x * gridSize + 10, segment.y * gridSize + 20);
            ctx.lineTo(segment.x * gridSize + 10, segment.y * gridSize + 30);
            ctx.strokeStyle = 'red';
            ctx.stroke();
        }
    });
}

// Draw Food
function drawFood() {
    ctx.fillStyle = '#f39c12'; // Food in bright yellow/orange
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

// Move Snake
function moveSnake() {
    const newHead = {x: snake[0].x + direction.x, y: snake[0].y + direction.y};
    snake.unshift(newHead);

    // Check if snake eats food
    if (newHead.x === food.x && newHead.y === food.y) {
        score += 10;
        scoreDisplay.innerHTML = 'Score: ' + score;
        spawnFood();
    } else {
        snake.pop();
    }
}

// Spawn Food
function spawnFood() {
    food.x = Math.floor(Math.random() * canvas.width / gridSize);
    food.y = Math.floor(Math.random() * canvas.height / gridSize);
}

// Check Collision
function checkCollision() {
    // Check wall collision
    if (snake[0].x < 0 || snake[0].y < 0 || snake[0].x >= canvas.width / gridSize || snake[0].y >= canvas.height / gridSize) {
        return true;
    }
    // Check self-collision
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    return false;
}

// Game Over
function gameOver() {
    lives -= 1;
    livesDisplay.innerHTML = 'Lives: ' + lives;
    if (lives <= 0) {
        resetGame();
        alert('Game Over');
    } else {
        // Reset snake position and continue
        snake = [{x: 8, y: 8}];
        direction = {x: 1, y: 0};
    }
}

// Game Loop
function gameLoop() {
    if (checkCollision()) {
        gameOver();
        return;
    }

    moveSnake();
    draw();
}

// Draw Everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawFood();
}

// Start Game
function startGame() {
    isPlaying = true;
    gameInterval = setInterval(gameLoop, levelSpeed);
    pauseBtn.disabled = false;
    playBtn.disabled = true;
}

// Pause Game
function pauseGame() {
    isPlaying = false;
    clearInterval(gameInterval);
    playBtn.disabled = false;
    pauseBtn.disabled = true;
}

// Reset Game
function resetGame() {
    clearInterval(gameInterval);
    snake = [{x: 8, y: 8}];
    direction = {x: 1, y: 0};
    food = {x: 10, y: 10};
    lives = 3;
    score = 0;
    levelSpeed = 100;
    livesDisplay.innerHTML = 'Lives: ' + lives;
    scoreDisplay.innerHTML = 'Score: ' + score;
    playBtn.disabled = false;
    pauseBtn.disabled = true;
}

// Change Level Speed
function setLevelSpeed(level) {
    if (level === 'easy') {
        levelSpeed = 150;
    } else if (level === 'medium') {
        levelSpeed = 100;
    } else if (level === 'hard') {
        levelSpeed = 50;
    }
    if (isPlaying) {
        clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, levelSpeed);
    }
}

// Event Listeners
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' && direction.y === 0) {
        direction = {x: 0, y: -1};
    } else if (e.key === 'ArrowDown' && direction.y === 0) {
        direction = {x: 0, y: 1};
    } else if (e.key === 'ArrowLeft' && direction.x === 0) {
        direction = {x: -1, y: 0};
    } else if (e.key === 'ArrowRight' && direction.x === 0) {
        direction = {x: 1, y: 0};
    }
});

// Button Click Events
playBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', pauseGame);
resetBtn.addEventListener('click', resetGame);
easyBtn.addEventListener('click', () => setLevelSpeed('easy'));
mediumBtn.addEventListener('click', () => setLevelSpeed('medium'));
hardBtn.addEventListener('click', () => setLevelSpeed('hard'));