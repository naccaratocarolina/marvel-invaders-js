// Codigo das teclas usadas para o jogo
const KEY_LEFT = 37;
const KEY_RIGHT = 39;
const KEY_SPACE = 32;

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
    this.keys = {};
    this.gameCanvas = null;

    // Posicao anterior do x
    this.previousX = 0;

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
};

/**
 * Ship.
 *
 * É a nave do usuario que está jogando.
 * Ela possui uma posicao e o id do personagem escolhido.
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
function Fire(x, y, speed) {
    this.x = x;
    this.y = y;
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
