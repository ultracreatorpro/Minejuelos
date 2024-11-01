const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");

const scale = 20;
const rows = 20;
const columns = 20;
canvas.width = canvas.height = scale * rows;

let snake;
let apple;
let score = 0;
let gameInterval;

function Snake() {
    this.x = 10;
    this.y = 10;
    this.xSpeed = scale;
    this.ySpeed = 0;
    this.total = 0;
    this.tail = [];

    this.draw = function() {
        ctx.fillStyle = "#00FF00";
        for (let i = 0; i < this.tail.length; i++) {
            ctx.fillRect(this.tail[i].x, this.tail[i].y, scale, scale);
        }
        ctx.fillRect(this.x, this.y, scale, scale);
    };

    this.update = function() {
        for (let i = 0; i < this.tail.length - 1; i++) {
            this.tail[i] = this.tail[i + 1];
        }
        if (this.total >= 1) {
            this.tail[this.total - 1] = { x: this.x, y: this.y };
        }

        this.x += this.xSpeed;
        this.y += this.ySpeed;

        if (this.x >= canvas.width) {
            this.x = 0;
        } else if (this.x < 0) {
            this.x = canvas.width - scale;
        }

        if (this.y >= canvas.height) {
            this.y = 0;
        } else if (this.y < 0) {
            this.y = canvas.height - scale;
        }
    };

    this.changeDirection = function(direction) {
        switch (direction) {
            case "Up":
                if (this.ySpeed === 0) {
                    this.xSpeed = 0;
                    this.ySpeed = -scale;
                }
                break;
            case "Down":
                if (this.ySpeed === 0) {
                    this.xSpeed = 0;
                    this.ySpeed = scale;
                }
                break;
            case "Left":
                if (this.xSpeed === 0) {
                    this.xSpeed = -scale;
                    this.ySpeed = 0;
                }
                break;
            case "Right":
                if (this.xSpeed === 0) {
                    this.xSpeed = scale;
                    this.ySpeed = 0;
                }
                break;
        }
    };

    this.eat = function(apple) {
        if (this.x === apple.x && this.y === apple.y) {
            this.total++;
            score++;
            return true;
        }
        return false;
    };

    this.checkCollision = function() {
        for (let i = 0; i < this.tail.length; i++) {
            if (this.x === this.tail[i].x && this.y === this.tail[i].y) {
                this.total = 0;
                this.tail = [];
                score = 0;
                clearInterval(gameInterval);
                startButton.style.display = "none";
                restartButton.style.display = "block";
            }
        }
    };
}

function Apple() {
    this.x;
    this.y;

    this.randomLocation = function() {
        this.x = Math.floor(Math.random() * rows) * scale;
        this.y = Math.floor(Math.random() * columns) * scale;
    };

    this.draw = function() {
        ctx.fillStyle = "#FF0000";
        ctx.fillRect(this.x, this.y, scale, scale);
    };
}

function startGame() {
    snake = new Snake();
    apple = new Apple();
    apple.randomLocation();
    score = 0;

    gameInterval = window.setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        snake.update();
        snake.draw();
        apple.draw();

        if (snake.eat(apple)) {
            apple.randomLocation();
        }

        snake.checkCollision();

        document.getElementById("score").innerText = "Score: " + score;
    }, 100);
}

startButton.addEventListener("click", () => {
    startButton.style.display = "none";
    startGame();
});

restartButton.addEventListener("click", () => {
    restartButton.style.display = "none";
    startGame();
});

window.addEventListener("keydown", evt => {
    const direction = evt.key.replace("Arrow", "");
    snake.changeDirection(direction);
});
