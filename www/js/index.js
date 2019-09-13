var canvas, ctx, ALTURA, LARGURA, frames = 0, chao, bloco, maxPulo = 3, velocidade = 6, estadoAtual, pontos = 0, perdeu = 0;
var audio = new Audio('./kyodai-mahjongg-1842-keygen-music.mp3');

ALTURA = window.innerHeight;//altura da tela
LARGURA = window.innerWidth;//largura da tela

obstaculo = {
    _obs: [],
    cores : ["#ffbc1c", "#ff1c1c", "#ff85e1", "#52a7ff", "#78ff5d"],
    tempo: 0,
    insere: function(){
        this._obs.push({
            x: LARGURA,
            largura: 30 + Math.floor(21 * Math.random()),
            altura: 30 + Math.floor(110 * Math.random()),
            cor: this.cores[Math.floor(5 * Math.random())],
        });
        this.tempo = 30 + Math.floor(42 * Math.random());
    },

    atualiza: function() {
        if (this.tempo == 0) {
            this.insere();
        }
        else{
            this.tempo--;
        }
        for (var i = 0, tam = this._obs.length; i < tam; i++) {
            var obs = this._obs[i];

            obs.x -= velocidade;
            if (bloco.x < obs.x + obs.largura && bloco.x + bloco.largura >=  obs.x && bloco.y + bloco.altura >= chao.y - obs.altura) {
                estadoAtual = estados.perdeu;
            }

            else if(obs.x <= -obs.largura){
                pontos++;
                this._obs.splice(i, 1);
                tam--;
                i--;
            }
        }
    },

    limpa: function(){
        this._obs = [];
    },

    desenha: function() {
        for (var i = 0, tam = this._obs.length; i < tam; i++) {
            var obs = this._obs[i];
            ctx.fillStyle = obs.cor;
            ctx.fillRect(obs.x, chao.y - obs.altura, obs.largura, obs.altura)
        }
    }
},

placar = {
    x: 10,
    y: 10,

    desenha: function(pontos){
        this.x = ALTURA+150;
        this.y = 30;

        ctx.fillStyle="#fff";
        ctx.font = "20px Georgia";
        ctx.fillText(pontos+" PONTOS", this.x,this.y);
    }
}

sair = {
    desenha: function(){
        this.x = 50;
        this.y = 30;

        ctx.fillStyle="#fff";
        ctx.font = "20px Georgia";
        ctx.fillText("SAIR", this.x,this.y);
    }
}

saltos = {
    x: 10,
    y: 10,

    desenha: function(salto){
        this.x = ALTURA+150;
        this.y = 60;

        ctx.fillStyle="#fff";
        ctx.font = "20px Georgia";
        ctx.fillText(salto+" SALTOS", this.x,this.y);
    }
}

bloco = {
    x: 50,
    y: 0,
    altura: 40,
    largura: 60,
    cor: "#ffa500",
    gravidade: 0.8,
    velocidade: 0,
    forcaPulo: 15,
    qtdPulo: 0,

    atualiza: function(){
        this.velocidade += this.gravidade;
        this.y += this.velocidade;
        if (this.y > (chao.y - this.altura) && estadoAtual != estados.perdeu) {
            this.y = chao.y - this.altura; 
            this.qtdPulo = 0;
            this.velocidade = 0;
        }
    },

    pula: function(){
        if (this.qtdPulo < maxPulo) {
            this.velocidade = -this.forcaPulo;
            this.qtdPulo++;                     
        }
    },

    desenha: function(){
        var img = new Image();
        img.src = './img/bloco.png';
        ctx.drawImage(img,this.x,this.y, this.largura, this.altura);
    }
}

estados = {
    jogar: 0,
    jogando: 1,
    perdeu: 2
},

chao = {
    y: ALTURA - 30,
    altura: 50,
    cor: "#a0a0a0",

    desenha: function(){
        ctx.fillStyle = this.cor;
        ctx.fillRect(0,this.y, LARGURA, this.altura);
    }
}

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener ("deviceready", this.onDeviceReady, false);
        document.addEventListener ("backbutton", this.backButtonHandler, false); 
        document.addEventListener("mousedown", this.controle, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        canvas = document.createElement("canvas");
        canvas.width = LARGURA;
        canvas.height = ALTURA;
        ctx = canvas.getContext("2d");
        document.body.appendChild(canvas);
        estadoAtual = estados.jogar;
        app.roda();
    },

    tocaAudio: function() {
        audio.play();
        setTimeout("app.tocaAudio()", 5000);
    },

    desenha: function() {
        var img = new Image();
        img.src = './img/city.png';
        ctx.drawImage(img, 0 , 0,LARGURA, ALTURA);

        if(estadoAtual == estados.jogar){
            var img = new Image();
            img.src = './img/play.png';
            ctx.drawImage(img, ((LARGURA / 2) - 50) , ((ALTURA / 2) - 50), 100, 100);
            pontos = 0;
        }
        else if(estadoAtual == estados.perdeu){
            var img = new Image();
            img.src = './img/over.png';
            ctx.drawImage(img, ((LARGURA / 2) - 50) , ((ALTURA / 2) - 50), 100, 100);
            perdeu = 1;
        }               
        else if(estadoAtual == estados.jogando){
            obstaculo.desenha();
        }

        chao.desenha();
        bloco.desenha();
        placar.desenha(pontos);
        sair.desenha();
        saltos.desenha(bloco.qtdPulo);
    },

    atualiza: function() {
        frames++;
        bloco.atualiza();
        if (estadoAtual == estados.jogando) {
            obstaculo.atualiza();                   
        }               
        else if (estadoAtual == estados.perdeu) {
            obstaculo.limpa();                  
        }
    },

    roda: function() {
        app.atualiza();
        app.desenha();
        window.requestAnimationFrame(app.roda);
    },

    controle: function() {
        if(event.clientY < 50 && event.clientX < 100){  
            app.backButtonHandler();
        }

        if(event.clientY > 50){ 
            app.tocaAudio();
            if (estadoAtual == estados.jogando) {
                bloco.pula();                   
            }
            else if (estadoAtual == estados.jogar) {
                estadoAtual = estados.jogando;
            }
            else if (estadoAtual == estados.perdeu && bloco.y >= 2 * ALTURA) {
                estadoAtual = estados.jogar;
                bloco.velocidade = 0;
                bloco.y = 0;
            }
        }
    },

    backButtonHandler: function(e) {
        navigator.app.exitApp ();     
    }
  
};
