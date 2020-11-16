// Codigo das teclas usadas para o jogo
const KEY_LEFT = 37;
const KEY_RIGHT = 39;
const KEY_SPACE = 32;
const KEY_ENTER = 13;

function Game() {
    // Atributos e valores default
    this.intervalId = 0;

    // Dimensoes do jogo/canvas
    this.width = 0;
    this.height = 0;
    this.gameDimentions = {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
    }

    // Input/Output (eventos do teclado)
    this.keys = {
        left: false,
        right: false,
        space: false
    };

    // Informacoes do canvas do jogo
    this.gameCanvas = null;
    this.gameContext = null;

    // Entidades do jogo
    this.ship = null;
    this.fires = [];
    this.invaders = [];
    this.bombs = [];

    // Estados do jogo
    this.life = 100;
    this.lastFireTime = null;
    this.lastBombTime = null;
    this.dt = 0; // delta t para criar movimento para os objetos

    // Configuracoes iniciais do jogo
    this.settings = {
        // Gerais
        framesPerSecond: 10,

        // Ship
        shipSpeed: 100,

        // Fire (ship)
        fireSpeed: 120,
        fireDamage: 5,
        fireMaxFrequency: 2,

        // Invader
        invaderSpeed: {
            x: 25,
            y: 10
        },
        bombDamage: 5,
        invaderRows: 5,
        invaderColums: 3,

        // Bomb (invaders)
        bombFrequency: 0.5,
        bombSpeed: 50
    };
}

// Funcao principal que inicializa o jogo
Game.prototype.initialise = function (gameCanvas) {
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
        left: 20,
        top: 0,
        right: gameCanvas.width - 110,
        bottom: gameCanvas.height
    }

    // Printa na tela as informacoes do jogador
    const playerImage = document.getElementById("player-image");
    playerImage.src = localStorage.getItem("playerImage");

    const playerName = document.createElement("h2");
    playerName.textContent = localStorage.getItem("playerName");

    // Cria o versus
    const div = document.createElement("div");
    div.setAttribute("class", "versus");
    const versus = document.createElement("h1");
    versus.textContent = "x";

    // Printa na tela as informacoes do invasor
    const invaderImage = document.getElementById("invader-image");
    invaderImage.src = localStorage.getItem("invaderImage");

    const invaderName = document.createElement("h2");
    invaderName.textContent = localStorage.getItem("invaderName");

    // Salva as informacoes do jogador e invasor e mostra na tela
    details.appendChild(playerImage);
    details.appendChild(playerName);
    details.appendChild(div);
    div.appendChild(versus);
    details.appendChild(invaderName);
    details.appendChild(invaderImage);

    // Cria a nave com a imagem salva no local storage
    this.ship = new Ship(350, 1300, localStorage.getItem("playerImage"));

    // Preenche a variavel de invasores em funcao da quantidade de linhas e colunas dos mesmos
    self.fillRowsAndColumnsInvaders();
};

Game.prototype.start = function () {
    // Cria movimento para as entidades do jogo
    const self = this;
    this.intervalId = setInterval(function () {
        self.draw();
        self.update();
        self.updateFire();
        self.drawBomb();
        self.collision();
    }, 1000 / this.settings.framesPerSecond);
}

Game.prototype.draw = function () {
    const self = this;
    // Desenha a nave
    self.drawShip();

    // Desenha os invasores
    self.drawInvaders();
}

Game.prototype.update = function () {
    const self = this;

    // Atualiza a vida do jogador dinamicamente
    document.getElementById("life").innerHTML = this.life + "%";

    // Cria movimento para a nave
    if (this.keys.right) {
        if (this.ship.x <= (this.gameDimentions.right)) {
            this.ship.x += this.dt * this.settings.shipSpeed;
        }
    }
    if (this.keys.left) {
        if (this.ship.x >= this.gameDimentions.left) {
            this.ship.x -= this.dt * this.settings.shipSpeed;
        }
    }

    // Atira quando a tecla espaco for apertada
    if (this.keys.space) {
        self.shootFire();
    }

    // Cria movimento para os invasores
    self.updateInvaders();

    // Cria movimento para as bombas
    self.updateBomb();

    // Se a vida do jogador acabar
    if (this.life === 0) {
        self.stop();
        gameOver();
        hideMessage();
    }

    // Se os invasores atingirem a base do canvas, ou se os invasores encostarem no jogador
    this.invaders.map((invader) => {
        if ((invader.y + 150) >= this.ship.y && invader.x >= this.ship.x && invader.x <= (this.ship.x + 100)
            || (invader.y + 150) > this.gameDimentions.bottom) {
            self.stop();
            gameOver();
            hideMessage();
        }
    });

    // Se o jogador eliminar todos os invasores
    if (this.invaders.length === 0) {
        self.stop();
        winner();
        hideMessage();
    }
}

Game.prototype.drawShip = function () {
    const gameContext = this.gameContext;

    // Salva a posicao atual da nave
    let x = this.ship.x;
    let y = this.ship.y;

    // Desenha a imagem no canvas
    const img = new Image();
    img.onload = function () {
        gameContext.drawImage(img, x, y);
    };
    img.src = this.ship.character;

    // Limpa o canvas
    gameContext.clearRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);
}


Game.prototype.shootFire = function () {
    // Cria um novo fire sempre que essa funcao é chamada numa frequencia de 2 tiros por segundo
    if (this.lastFireTime === null || ((new Date()).valueOf() - this.lastFireTime) > (1000 / this.settings.fireMaxFrequency))  {
        this.fires.push(new Fire((this.ship.x + 46), 1300, 10, this.settings.fireSpeed));
        this.lastFireTime = (new Date()).valueOf();
    }
}

Game.prototype.drawFire = function () {
    // Pega o contexto do canvas do jogo
    const gameContext = this.gameContext;
    // Limpa o canvas
    gameContext.clearRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);

    // Desenha os tiros no canvas
    gameContext.fillStyle = "#FBFAF5";
    for (let i=0; i<this.fires.length; i++) {
        const fire = this.fires[i];
        gameContext.fillRect(fire.x, fire.y, fire.size, fire.size);
    }
}

Game.prototype.updateFire = function () {
    this.drawFire();
    // Cria movimento para o tiro, de baixo pra cima
    for (let i=0; i<this.fires.length; i++) {
        const fire = this.fires[i];
        fire.y -= this.dt * fire.speed;
    }
}

Game.prototype.fillRowsAndColumnsInvaders = function () {
    // Preenche a quantidade de invasores em funcao das variaveis de classe invaderRows e invaderColumns
    for (let i=0; i<this.settings.invaderRows; i++) {
        for (let j=0; j<this.settings.invaderColums; j++) {
            const dx = (this.width - (this.settings.invaderColums*130))/4;
            this.invaders.push(new Invader((dx+i*130), (j*180), 15, localStorage.getItem("invaderImage")));
        }
    }
}

Game.prototype.drawInvader = function (i) {
    const gameContext = this.gameContext;

    // Salva a posicao atual da nave
    let x = this.invaders[i].x;
    let y = this.invaders[i].y;

    // Desenha a imagem no canvas
    const img = new Image();
    img.onload = function () {
        gameContext.drawImage(img, x, y);
    };
    img.src = this.invaders[i].character;
}

Game.prototype.drawInvaders = function () {
    // Desenha os invasores no canvas
    for (let i=0; i<this.invaders.length; i++) {
        this.drawInvader(i);
    }
}

Game.prototype.updateInvaders = function () {
    this.drawInvaders();
    let hitLeft = false, hitRight = false, hitBottom = false;
    this.invaders.map((invader) => {
        let nextX = invader.x + this.dt * this.settings.invaderSpeed.x;
        let nextY = invader.y +  this.dt * this.settings.invaderSpeed.y;

        if (hitRight === false && nextX > this.gameDimentions.right) {
            hitRight = true;
        }
        else if (hitLeft === false && nextX < this.gameDimentions.left) {
            hitLeft = true;
        }
        else if (hitBottom === false && nextY > this.gameDimentions.bottom) {
            hitBottom = true;
        }

        // Só cria movimento enquanto ele nao tiver atingido a direita, esquerda e base do canvas
        if (!hitLeft && !hitRight && !hitBottom) {
            invader.x = nextX;
            invader.y = nextY;
        }
    });

    // Se ele atingir a direita, inverte a velocidade
    if (hitRight === true) {
        this.settings.invaderSpeed.x *= -1;
        hitRight = false;
    }

    // Se ele atingir a esquerda, inverte a velocidade
    if (hitLeft === true) {
        this.settings.invaderSpeed.x *= -1;
        hitLeft = false;
    }
}

Game.prototype.dropBomb = function () {
    // Lanca as bombas aleatoriamente numa determinada frequencia
    if (this.invaders.length > 0 && this.lastBombTime === null ||
        ((new Date()).valueOf() - this.lastBombTime) > (1000 / this.settings.bombFrequency)) {
        // Aleatoriza o id do invader que esta lancando a bomba
        let i = Math.floor(Math.random() * this.invaders.length);
        let invader = this.invaders[i];
        // Cria a bomba e adiciona no array
        this.bombs.push(new Bomb((invader.x + 46), invader.y, 8, this.settings.bombSpeed));
        this.lastBombTime = (new Date().valueOf());
    }
}

Game.prototype.drawBomb = function () {
    // Pega o contexto do canvas do jogo
    const gameContext = this.gameContext;

    // Desenha as bombas (circunferencias)
    gameContext.fillStyle = "#FBFAF5";
    for (let i=0; i<this.bombs.length; i++) {
        const bomb = this.bombs[i];
        gameContext.beginPath();
        gameContext.arc(bomb.x, bomb.y, bomb.size, 0, 2*Math.PI);
        gameContext.fillStyle = '#FBFAF5';
        gameContext.fill();
        gameContext.stroke();
    }
}

Game.prototype.updateBomb = function () {
    this.dropBomb();
    // Cria movimento para as bombas
    for (let i=0; i<this.bombs.length; i++) {
        const bomb = this.bombs[i];
        bomb.y += this.dt * bomb.speed;
    }
}

Game.prototype.collision = function () {
    // Colisao da bomba com a nave
    for (let i=0; i<this.bombs.length; i++) {
        let bomb = this.bombs[i];
        if (bomb.x >= this.ship.x && bomb.x <= (this.ship.x + 100)
            && bomb.y >= this.ship.y && bomb.y < this.gameDimentions.bottom) {
            // Atualiza a vida
            this.life -= this.settings.bombDamage;
            // Remove a bomba
            this.bombs.splice(i, 1);
        }
    }

    // Colisao do tiro com os invaders
    for (let i=0; i<this.fires.length; i++) {
        let fire = this.fires[i];
        for (let j=0; j<this.invaders.length; j++) {
            let invader = this.invaders[j];
            if (fire.y <= (invader.y + 150) && fire.x >= invader.x && fire.x <= (invader.x + 150)) {
                // Atualiza a vida do invader
                invader.life -= this.settings.fireDamage;
                // Remove o tiro
                this.fires.splice(i, 1);
                // Se a vida do invader acabar
                if (invader.life <= 0) {
                    // Remove esse invader
                    this.invaders.splice(j, 1);
                }
            }
        }
    }
}

// Encerra o jogo
Game.prototype.stop = function () {
    clearInterval(this.intervalId);
}

// Evento que escuta do HTML o codigo das teclas que foram apertadas
Game.prototype.pressedKey = function (keyCode) {
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

// Evento que escuta do HTML o codigo das teclas que foram desapertadas
Game.prototype.unpressedKey = function (keyCode) {
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
 * Ela possui uma posicao (x , y) e a string com a src da imagem do player (character).
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
 * Essa entidade armazena a posizao (x, y) do tiro, o seu tamanho (size) e velocidade (speed).
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
 * Ela possui uma posicao (x, y), a vida (life) e a src da imagem do invasor (character).
 *
 * @param x
 * @param y
 * @param character
 */
function Invader(x, y, life, character) {
    this.x = x;
    this.y = y;
    this.life = life;
    this.character = character;
}

/**
 * Bomb.
 *
 * Bombas jogadas pelos invasores.
 * Essa entidade armazena a posizao (x, y) da bomba, o seu tamanho (size) e velocidade (speed).
 *
 * @param x
 * @param y
 * @param speed
 * @constructor
 */
function Bomb(x, y, size, speed) {
    this.x = x;
    this.y = y;
    this.size = size, this.speed = speed;
}

/**
 * Funcao que ora esconde a mensagem do estado do jogo, ora mostra a mesma.
 */
function hideMessage() {
    let game = document.getElementById("game");
    let messageGameState = document.getElementById("message-game-state");

    if (messageGameState.style.display === "none") {
        messageGameState.style.display = "block";
    } else {
        messageGameState.style.display = "none";
    }
}

/**
 * Funcao que personaliza a mensagem indicando o fim do jogo.
 */
function gameOver() {
    document.getElementById("message").innerHTML = "Game over!";
    document.getElementById("start-game").innerHTML = "Início";
    document.getElementById("start-game").onclick = function () {
        location.href = "index.html";
    }
}

/**
 * Funcao que personaliza a mensagem indicando que o jogador venceu o jogo.
 */
function winner() {
    document.getElementById("message").innerHTML = "Parabéns!!!";
    document.getElementById("start-game").innerHTML = "Início";
    document.getElementById("start-game").onclick = function () {
        location.href = "index.html";
    }
}
