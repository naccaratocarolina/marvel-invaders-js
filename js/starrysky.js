function Starrysky() {
    // Atributos e valores default
    this.framesPerSecond = 30;
    this.canvas = null;
    this.width = 0;
    this.height = 0;
    this.minSpeed = 15;
    this.maxSpeed = 30;
    this.stars = 100; //array de estrelas
    this.intervalId = 0;
}

// Funcao principal que inicializa o fundo de estrelas
Starrysky.prototype.initialise = function(div) {
    const self = this;

    // Armazena a largura e altura da div fornecida
    this.div = div;
    self.width = window.innerWidth;
    self.height = window.innerHeight;

    // Para fazer com que as estrelas caiam de cima para baixo
    window.onresize = function(event) {
        self.width = window.innerWidth;
        self.height = window.innerHeight;
        self.canvas.width = self.width;
        self.canvas.height = self.height;
        self.draw();
    }

    // Cria o canvas
    const canvas = document.createElement('canvas');
    div.appendChild(canvas);
    this.canvas = canvas;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
};

Starrysky.prototype.start = function() {
    // Cria as estrelas com tamanhos e velocidades aleatórias
    const stars = [];
    for (var i=0; i<this.stars; i++) {
        x = Math.random() * this.width;
        y = Math.random() * this.height;
        size = Math.random() * 3+1;
        speed = Math.random() * (this.maxSpeed - this.minSpeed) + this.minSpeed;
        stars[i] = new Star(x, y, size, speed);
    }
    this.stars = stars;

    var self = this;
    // Comeca o timer
    this.intervalId = setInterval(function() {
        self.update();
        self.draw();
    }, 1000/this.framesPerSecond);
};

Starrysky.prototype.stop = function() {
    clearInterval(this.intervalId);
};

Starrysky.prototype.update = function() {
    const time = 1 / this.framesPerSecond;

    // Cria movimento para cada estrela
    for (var i = 0; i < this.stars.length; i++) {
        const star = this.stars[i];
        star.y += time * star.speed;

        // Se a estrela chegar no final da tela, move-la para o topo
        if(star.y > this.height) {
            x = Math.random() * this.width;
            y = 0;
            size = Math.random() * 3 + 1;
            speed = Math.random() * (this.maxSpeed - this.minSpeed) + this.minSpeed;
            this.stars[i] = new Star(x, y, size, speed);
        }
    }
};

Starrysky.prototype.draw = function() {
    // Pega o contexto do canvas
    const canvasContext = this.canvas.getContext("2d");

    // Cria o background
    canvasContext.fillStyle = "#25221E";
    canvasContext.fillRect(0, 0, this.width, this.height);

    // Desenha as estrelas no canvas
    canvasContext.fillStyle = "#FBFAF5";
    for (var i=0; i<this.stars.length; i++) {
        const star = this.stars[i];
        canvasContext.fillRect(star.x, star.y, star.size, star.size);
    }
};

function Star(x, y, size, speed) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = speed;
}

const container = document.getElementById("starry-sky");
const starrySky = new Starrysky();
starrySky.initialise(container);
starrySky.start();
