const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = 800;
canvas.height = 400;

// Game objects
const paddleWidth = 10;
const paddleHeight = 80;
const ballSize = 8;

let player = {
    x: 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0,
    speed: 6
};

let computer = {
    x: canvas.width - paddleWidth - 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0,
    speed: 5
};

let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: ballSize,
    dx: 5,
    dy: 5,
    speed: 5
};

let score = {
    player: 0,
    computer: 0
};

// Keyboard input
const keys = {};
window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Mouse input
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    player.y = mouseY - player.height / 2;
});

// Update game state
function update() {
    // Player paddle movement with arrow keys
    if (keys['ArrowUp']) {
        player.y -= player.speed;
    }
    if (keys['ArrowDown']) {
        player.y += player.speed;
    }

    // Keep player paddle in bounds
    if (player.y < 0) player.y = 0;
    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
    }

    // Computer AI
    const computerCenter = computer.y + computer.height / 2;
    const ballCenter = ball.y;

    if (computerCenter < ballCenter - 35) {
        computer.y += computer.speed;
    } else if (computerCenter > ballCenter + 35) {
        computer.y -= computer.speed;
    }

    // Keep computer paddle in bounds
    if (computer.y < 0) computer.y = 0;
    if (computer.y + computer.height > canvas.height) {
        computer.y = canvas.height - computer.height;
    }

    // Ball movement
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Ball collision with top and bottom walls
    if (ball.y - ball.radius < 0) {
        ball.y = ball.radius;
        ball.dy = -ball.dy;
    }
    if (ball.y + ball.radius > canvas.height) {
        ball.y = canvas.height - ball.radius;
        ball.dy = -ball.dy;
    }

    // Ball collision with player paddle
    if (
        ball.x - ball.radius < player.x + player.width &&
        ball.y > player.y &&
        ball.y < player.y + player.height
    ) {
        ball.x = player.x + player.width + ball.radius;
        ball.dx = -ball.dx;

        // Add spin based on where ball hits paddle
        const deltaY = ball.y - (player.y + player.height / 2);
        ball.dy = deltaY * 0.1;
    }

    // Ball collision with computer paddle
    if (
        ball.x + ball.radius > computer.x &&
        ball.y > computer.y &&
        ball.y < computer.y + computer.height
    ) {
        ball.x = computer.x - ball.radius;
        ball.dx = -ball.dx;

        // Add spin based on where ball hits paddle
        const deltaY = ball.y - (computer.y + computer.height / 2);
        ball.dy = deltaY * 0.1;
    }

    // Ball out of bounds (left side - computer scores)
    if (ball.x - ball.radius < 0) {
        score.computer++;
        document.getElementById('computerScore').textContent = score.computer;
        resetBall();
    }

    // Ball out of bounds (right side - player scores)
    if (ball.x + ball.radius > canvas.width) {
        score.player++;
        document.getElementById('playerScore').textContent = score.player;
        resetBall();
    }
}

// Reset ball to center
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = (Math.random() > 0.5 ? 1 : -1) * ball.speed;
    ball.dy = (Math.random() - 0.5) * ball.speed;
}

// Draw functions
function draw() {
    // Clear canvas
    ctx.fillStyle = '#16213e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw center line
    ctx.strokeStyle = '#0f3460';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw paddles
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(player.x, player.y, player.width, player.height);
    ctx.fillRect(computer.x, computer.y, computer.width, computer.height);

    // Draw ball
    ctx.fillStyle = '#ffff00';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
}

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Reset game
function resetGame() {
    score.player = 0;
    score.computer = 0;
    document.getElementById('playerScore').textContent = score.player;
    document.getElementById('computerScore').textContent = score.computer;
    resetBall();
}

// Start game
gameLoop();
