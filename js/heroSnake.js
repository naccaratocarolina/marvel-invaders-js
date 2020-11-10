const KEY_LEFT = 37;
const KEY_UP = 38;
const KEY_RIGHT = 39;
const KEY_DOWN = 40;

function HeroSnake() {
    // Atributos e seus valores default
    this.framesPerSecond = 30;
    this.intervalId = 0;

    this.width = 0;
    this.height = 0;

    this.box = 32; // Cria uma unidade

    this.snake = [];

    this.food = {
        x: Math.floor(Math.random()*17+1) * this.box,
        y: Math.floor(Math.random()*15+3) * this.box
    }

    this.direction; // Controle da cobra
}

document.addEventListener("keydown", snakeDirection);
function snakeDirection(event) {
    const key = event.keyCode;
    if(key === KEY_LEFT) {
        this.direction = "LEFT";
    } else if (key === KEY_RIGHT) {
        this.direction = "RIGHT";
    } else if (key === KEY_UP) {
        this.direction = "UP";
    } else if (key === KEY_DOWN) {
        this.direction = "DOWN";
    }
}

HeroSnake.prototype.createBoard = function (gameCanvas) {
    // Salva o canvas do jogo
    this.gameCanvas = gameCanvas;

    // Armazena as dimensoes do canvas dado
    this.width = gameCanvas.width;
    this.height = gameCanvas.height;

    this.snake[0] = {
        x : 9 * this.box,
        y : 10 * this.box
    }
}

HeroSnake.prototype.start = function () {
    var self = this;
    this.intervalId = setInterval(function () {
        self.draw();
    }, 1000/this.framesPerSecond);
}

HeroSnake.prototype.stop = function() {
    clearInterval(this.intervalId);
};

HeroSnake.prototype.draw = function () {
    const canvasContext = this.gameCanvas.getContext("2d");

    for(var i=0; i<this.snake.length; i++) {
        canvasContext.fillStyle = (i === 0) ? "green" : "white";
        canvasContext.fillRect(this.snake[i].x, this.snake[i].y, this.box, this.box);
    }

    canvasContext.fillStyle = "red";
    canvasContext.fillRect(this.food.x, this.food.y, this.box, this.box);

    var snakeX = this.snake[0].x;
    var snakeY = this.snake[0].y;

    console.log(snakeY);

    if( this.direction === "LEFT") snakeX -= this.box;
    if( this.direction === "UP") snakeY -= this.box;
    if( this.direction === "RIGHT") snakeX += this.box;
    if( this.direction === "DOWN") snakeY += this.box;

    if (snakeX === this.food.x && snakeY === this.food.y) {
        this.score++;
        this.food = {
            x: Math.floor(Math.random()*17+1) * this.box,
            y: Math.floor(Math.random()*15+3) * this.box
        }
    } else {
        this.snake.pop();
    }
}


