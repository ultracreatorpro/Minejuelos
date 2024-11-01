document.getElementById("start-button").addEventListener("click", startGame);
document.getElementById("restart-button").addEventListener("click", restartGame);

let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");

canvas.width = 300;
canvas.height = 600;

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = canvas.width / COLS;
let board = [];
let currentPiece;
let score = 0;
let gameOver = false;

const pieces = [
    { shape: [[1, 1, 1, 1]], color: "cyan" },          // I
    { shape: [[1, 1, 1], [0, 1, 0]], color: "blue" },  // T
    { shape: [[1, 1], [1, 1]], color: "yellow" },      // O
    { shape: [[1, 1, 0], [0, 1, 1]], color: "red" },   // Z
    { shape: [[0, 1, 1], [1, 1, 0]], color: "green" }, // S
    { shape: [[1, 1, 1], [1, 0, 0]], color: "orange" },// L
    { shape: [[1, 1, 1], [0, 0, 1]], color: "purple" } // J
];

function startGame() {
    document.getElementById("menu").classList.add("hidden");
    document.getElementById("game-container").classList.remove("hidden");
    board = createBoard();
    currentPiece = createPiece();
    score = 0;
    gameOver = false;
    document.getElementById("gameScore").innerText = score;
    gameLoop();
}

function restartGame() {
    document.getElementById("game-container").classList.add("hidden");
    document.getElementById("menu").classList.remove("hidden");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function createBoard() {
    let board = [];
    for (let y = 0; y < ROWS; y++) {
        board[y] = [];
        for (let x = 0; x < COLS; x++) {
            board[y][x] = 0;
        }
    }
    return board;
}

function createPiece() {
    const piece = pieces[Math.floor(Math.random() * pieces.length)];
    return {
        shape: piece.shape,
        color: piece.color,
        x: Math.floor(COLS / 2) - Math.ceil(piece.shape[0].length / 2),
        y: 0
    };
}

function drawBlock(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    ctx.strokeStyle = "#000";
    ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
}

function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            if (board[y][x]) {
                drawBlock(x, y, board[y][x]);
            }
        }
    }
    drawPiece(currentPiece);
}

function drawPiece(piece) {
    piece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                drawBlock(piece.x + x, piece.y + y, piece.color);
            }
        });
    });
}

function movePieceDown() {
    currentPiece.y++;
    if (collision()) {
        currentPiece.y--;
        placePiece();
        currentPiece = createPiece();
        if (collision()) {
            gameOver = true;
        }
    }
}

function movePiece(dir) {
    currentPiece.x += dir;
    if (collision()) {
        currentPiece.x -= dir;
    }
}

function rotatePiece() {
    const shape = currentPiece.shape;
    const rows = shape.length;
    const cols = shape[0].length;
    const newShape = [];

    // Crear una nueva matriz rotada basada en la forma original
    for (let y = 0; y < cols; y++) {
        newShape[y] = [];
        for (let x = 0; x < rows; x++) {
            newShape[y][x] = shape[rows - 1 - x][y];
        }
    }

    // Guardar la posición original
    const oldX = currentPiece.x;
    const oldY = currentPiece.y;

    // Verificar si la rotación está dentro del tablero
    currentPiece.shape = newShape;
    if (collision()) {
        currentPiece.shape = shape;  // Revertir a la forma original
        currentPiece.x = oldX;       // Revertir a la posición original en X
        currentPiece.y = oldY;       // Revertir a la posición original en Y
    } else {
        // Ajustar la posición X para evitar salirse del tablero
        if (currentPiece.x + newShape[0].length > COLS) {
            currentPiece.x = COLS - newShape[0].length;
        }
        // Ajustar la posición Y para evitar salirse del tablero por arriba
        if (currentPiece.y + newShape.length > ROWS) {
            currentPiece.y = ROWS - newShape.length;
        }
    }
}

function collision() {
    for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
            if (
                currentPiece.shape[y][x] &&
                (currentPiece.y + y >= ROWS || // Colisión con el fondo del tablero
                 currentPiece.x + x < 0 ||    // Colisión con el borde izquierdo
                 currentPiece.x + x >= COLS || // Colisión con el borde derecho
                 board[currentPiece.y + y][currentPiece.x + x]) // Colisión con piezas existentes
            ) {
                return true;
            }
        }
    }
    return false;
}
function placePiece() {
    currentPiece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                board[currentPiece.y + y][currentPiece.x + x] = currentPiece.color;
            }
        });
    });
    checkLines();
}

function checkLines() {
    let lines = 0;
    for (let y = ROWS - 1; y >= 0; y--) {
        if (board[y].every(value => value !== 0)) {
            board.splice(y, 1);
            board.unshift(new Array(COLS).fill(0));
            lines++;
        }
    }
    score += lines * 10;
    document.getElementById("gameScore").innerText = score;
}

function gameLoop() {
    if (!gameOver) {
        movePieceDown();
        drawBoard();
        setTimeout(gameLoop, 1000); // Velocidad del juego
    } else {
        alert("Game Over! Tus Puntos: " + score);
        restartGame();
    }
}

document.addEventListener("keydown", (event) => {
    if (!gameOver) {
        if (event.key === "ArrowLeft") {
            movePiece(-1);
        } else if (event.key === "ArrowRight") {
            movePiece(1);
        } else if (event.key === "ArrowDown") {
            movePieceDown();
        } else if (event.key === "ArrowUp") {
            rotatePiece();
        }
        drawBoard();
    }
});

