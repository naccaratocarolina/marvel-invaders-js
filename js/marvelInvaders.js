// Codigo das teclas usadas para o jogo
const KEY_LEFT = 37;
const KEY_RIGHT = 39;
const KEY_SPACE = 32;
const KEY_ENTER = 13;

function MarvelInvaders() {
    // Atributos e valores default
    this.playerImage = "";

    this.width = 0;
    this.height = 0;
    this.lives = 3;
    this.gameDimentions = {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
    }
    this.score = 0;
    this.level = 1;
    this.intervalId = 0;

    // Variavel que guarda o estado
    this.state = [];

    // Input/Output (eventos do teclado)
    this.keys = {
        left: false,
        right: false,
        space: false
    };
    this.gameCanvas = null;

    // Posicao anterior do x
    this.direction = 0;

    this.ship = null;
    this.fire = null;

    // Configuracoes iniciais do jogo
    this.settings = {
        // General
        framesPerSecond: 50,
        levelDificultyIncrease: 0.2,
        levelIncrease: 25,

        // Ship
        shipSpeed: 120,
        pointsPerInvader: 5,

        // Fire (ship)
        fireSpeed: 120,
        fireMaxFrequency: 2,

        // Invader
        invaderInitialSpeed: 25,
        invaderAceleration: 0,
        invaderBombRange: 20,
        invaderRows: 5,
        invaderColums: 10,

        // Bomb (invaders)
        bombFrequency: 0.05,
        bombMinSpeed: 50,
        bombMaxSpeed: 50
    };
}

// Funcao principal que inicializa o jogo
MarvelInvaders.prototype.initialise = function (gameCanvas) {
    // Salva o canvas do jogo
    this.gameCanvas = gameCanvas;

    // Armazena as dimensoes do canvas dado
    this.width = gameCanvas.width;
    this.height = gameCanvas.height;

    // Salva as dimensoes do jogo
    this.gameDimentions = {
        left: 0,
        top: 0,
        right: gameCanvas.width,
        bottom: gameCanvas.height
    }

    // Salva as informacoes do jogador e mostra na tela
    const playerImage = document.getElementById("player-image");
    playerImage.src = localStorage.getItem("playerImage");

    const playerName = document.createElement("h2");
    playerName.textContent = localStorage.getItem("playerName");

    details.appendChild(playerImage);
    details.appendChild(playerName);
    console.log(playerImage);

    // Cria a nave
    this.ship = new Ship(350, 1300, localStorage.getItem("playerImage"));
};

MarvelInvaders.prototype.start = function () {
    // Cria movimento
    const self = this;
    setInterval(function () {
        self.update();
        self.createShip();
    }, 1000/this.settings.framesPerSecond);
}

MarvelInvaders.prototype.update = function () {
    const self = this;

    if (this.keys.right) {
        if (this.ship.x <= 750) {
            this.ship.x += 10;
        }
    }
    if (this.keys.left) {
        if (this.ship.x >= 0) {
            this.ship.x -= 10;
        }
    }
    if (this.keys.space) {
        self.shipFire(y - 10)
    }
}

MarvelInvaders.prototype.createShip = function () {
    const gameContext = this.gameCanvas.getContext("2d");
    const img = new Image();
    var x = this.ship.x;
    var y = this.ship.y;
    img.onload = function () {
        gameContext.drawImage(img, x, y);
    };
    img.src = this.ship.character;
}

MarvelInvaders.prototype.pressedKey = function (keyCode) {
    if (keyCode === KEY_RIGHT) {
        this.keys.right = true;
    }
    else if (keyCode === KEY_LEFT) {
        this.keys.left = true;
    }
    else if (keyCode === KEY_SPACE || keyCode === KEY_ENTER) {
        this.keys.space = true;
    }
}

MarvelInvaders.prototype.unpressedKey = function (keyCode) {
    if (keyCode === KEY_RIGHT) {
        this.keys.right = false;
    }
    else if (keyCode === KEY_LEFT) {
        this.keys.left = false;
    }
    else if (keyCode === KEY_SPACE || keyCode === KEY_ENTER) {
        this.keys.space = false;
    }
}

/**
 * Ship.
 *
 * É a nave do usuario que está jogando.
 * Ela possui uma posicao e a string com a src da imagem do player.
 *
 * @param x
 * @param y
 * @param character
 * @constructor
 */
function Ship(x, y, character) {
    this.x = x;
    this.y = y;
    this.character = character;
}

/**
 * Fire.
 *
 * Tiro da nave do jogador.
 *
 * @param x
 * @param y
 * @param speed
 * @constructor
 */
function Fire(x, y, size, speed) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = speed;
}

/**
 * Invader.
 *
 * São as naves inimigas.
 * Ela possui uma posicao, a quantidade de invasores nas linhas
 * e colunas e o id do personagem escolhido.
 *
 * @param x
 * @param y
 * @param row
 * @param column
 * @param character
 */
function Invader(x, y, row, column, character) {
    this.x = x;
    this.y = y;
    this.row = row;
    this.column = column;
    this.character = character;
}

/**
 * Bomb.
 *
 * Bombas jogadas pelos invasores.
 *
 * @param x
 * @param y
 * @param speed
 * @constructor
 */
function Bomb(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
}
