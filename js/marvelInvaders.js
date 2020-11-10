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
    this.gameDimentions = {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
    }
    this.lives = 3;
    this.score = 0;
    this.level = 1;

    // Input/Output (eventos do teclado)
    this.keys = {
        left: false,
        right: false,
        space: false
    };
    this.gameCanvas = null;
    this.gameContext = null;

    // Posicao anterior do x
    this.direction = 0;

    // Entidades do jogo
    this.ship = null;
    this.fires = [];

    // Game states
    this.lastFireTime = null;
    this.dt = 0; // delta t para criar movimento para os objetos

    // Configuracoes iniciais do jogo
    this.settings = {
        // General
        framesPerSecond: 50,
        levelDificultyIncrease: 0.2,
        levelIncrease: 25,

        // Ship
        shipSpeed: 150,
        pointsPerInvader: 5,

        // Fire (ship)
        fireSpeed: 150,
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
    const self = this;

    // Salva o canvas do jogo e o seu contexto
    this.gameCanvas = gameCanvas;
    this.gameContext = gameCanvas.getContext("2d");

    // Delta t em funcao da quantidade de frames por segundo
    this.dt = 1 / this.settings.framesPerSecond;

    // Armazena as dimensoes do canvas dado
    this.width = gameCanvas.width;
    this.height = gameCanvas.height;

    // Salva as dimensoes do jogo
    this.gameDimentions = {
        left: 0,
        top: 0,
        right: gameCanvas.width - 100,
        bottom: gameCanvas.height
    }

    // Pega a imagem do personagem da marvel escolhido pelo jogador
    const playerImage = document.getElementById("player-image");
    playerImage.src = localStorage.getItem("playerImage");

    // Pega o nome do personagem da marvel escolhido pelo jogador
    const playerName = document.createElement("h2");
    playerName.textContent = localStorage.getItem("playerName");

    // Salva as informacoes do jogador e mostra na tela
    details.appendChild(playerImage);
    details.appendChild(playerName);
    console.log(playerImage);

    // Cria a nave com a imagem salva no local storage
    this.ship = new Ship(350, 1300, localStorage.getItem("playerImage"));

    // Desenha a nave no canvas
    self.drawShip();
};

MarvelInvaders.prototype.start = function () {
    // Cria movimento
    const self = this;
    setInterval(function () {
        self.update();
        self.drawShip();
        self.drawFire();
        self.updateFire();
    }, 1000 / this.settings.framesPerSecond);
}

MarvelInvaders.prototype.update = function () {
    const self = this;

    // Cria movimento para a direita se a seta para direita do teclado for apertada
    if (this.keys.right) {
        if (this.ship.x <= (this.gameDimentions.right)) {
            this.ship.x += this.dt * this.settings.shipSpeed;
        }
    }
    // Cria movimento para a esquerda se a seta para esquerda do teclado for apertada
    if (this.keys.left) {
        if (this.ship.x >= this.gameDimentions.left) {
            this.ship.x -= this.dt * this.settings.shipSpeed;
        }
    }
    // Atira quando o espaco ou enter do teclado forem apertados
    if (this.keys.space) {
        self.shootFire();
    }
}

MarvelInvaders.prototype.drawShip = function () {
    const gameContext = this.gameContext;

    // Salva a posicao atual da nave
    var x = this.ship.x;
    var y = this.ship.y;

    // Desenha a imagem no canvas
    const img = new Image();
    img.onload = function () {
        gameContext.drawImage(img, x, y);
    };
    img.src = this.ship.character;

    // Limpa o canvas
    gameContext.clearRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);
}


MarvelInvaders.prototype.shootFire = function () {
    // Cria um novo fire sempre que essa funcao é chamada numa frequencia de 2 tiros por segundo
    if (this.lastFireTime === null || ((new Date()).valueOf() - this.lastFireTime) > (1000 / this.settings.fireMaxFrequency))  {
        this.fires.push(new Fire((this.ship.x + 46), 1300, 10, this.settings.fireSpeed));
        this.lastFireTime = (new Date()).valueOf();
    }
}

MarvelInvaders.prototype.drawFire = function () {
    // Pega o contexto do canvas do jogo
    const gameContext = this.gameContext;
    // Limpa o canvas
    gameContext.clearRect(0, 1200, this.gameCanvas.width, this.gameCanvas.height);

    // Desenha os tiros no canvas
    gameContext.fillStyle = "#FBFAF5";
    for (var i=0; i<this.fires.length; i++) {
        const fire = this.fires[i];
        gameContext.fillRect(fire.x, fire.y, fire.size, fire.size);
    }
}

MarvelInvaders.prototype.updateFire = function () {
    // Cria movimento para o tiro, de baixo pra cima
    for (var i=0; i<this.fires.length; i++) {
        const fire = this.fires[i];
        fire.y -= this.dt * fire.speed;
    }
}

// Evento que escuta do HTML o codigo das teclas que foram apertadas
MarvelInvaders.prototype.pressedKey = function (keyCode) {
    // Se a tecla da direita for apertada
    if (keyCode === KEY_RIGHT) {
        this.keys.right = true;
    }
    // Se a tecla da esquerda for apertada
    else if (keyCode === KEY_LEFT) {
        this.keys.left = true;
    }
    // Se espaco ou enter forem apertados
    else if (keyCode === KEY_SPACE || keyCode === KEY_ENTER) {
        this.keys.space = true;
    }
}

// Evento que escuta do HTML o codigo das teclas que foram desapertadas
MarvelInvaders.prototype.unpressedKey = function (keyCode) {
    // Se a tecla da direita for desapertada
    if (keyCode === KEY_RIGHT) {
        this.keys.right = false;
    }
    // Se a tecla da esquerda for desapertada
    else if (keyCode === KEY_LEFT) {
        this.keys.left = false;
    }
    // Se espaco ou enter forem desapertada
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
