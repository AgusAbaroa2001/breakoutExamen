let jugador, bola, cuadros = []
let cols = 10, fila = 4
let niveles = 1
let puntos = 0
let vidas = 3
let velBola = 4
let infoNivel


function setup() {
    createCanvas(600, 400);
    jugador = new Jugador()
    bola = new Bola()
    cargaNivel(niveles)
  }
  
  function draw() {
    background(0);
    jugador.update()
    jugador.mostrar()
    bola.update()
    bola.verificarJugador(jugador)
    bola.suelo()
    bola.mostrar()

    for(let i = cuadros.length - 1; i >= 0; i--) {
        cuadros[i].mostrar()
        if (bola.golpe(cuadros[i])) {
            cuadros[i].golpe--
            if (cuadros[i].golpe <= 0 && !cuadros[i].irrompible) {
                cuadros.splice(i, 1)
                puntos++
                bola.reverseY()
            }else{
                bola.reverseY()
            }
        }
    }


    mostrarInfo()

    if (cuadros.length == 0) {
        niveles++
        if (niveles <= 3) {
            cargaNivel(niveles)
            bola.reset()
        }else{
            noLoop()
            textAlign(CENTER, CENTER)
            fill("red")
            textSize(24)
            text("QUE GUAPO ERES!!", width / 2, height / 2)
        }
    }

    if (vidas <=0) {
        noLoop()
        textAlign(CENTER, CENTER)
        fill("red")
        textSize(24)
        text("PERDEDOR DEFINITIVO", width / 2, height / 2)
        setTimeout(() => {
            reinicio()
        }, 3000)
    }

    efectoRetro()
  }

  //funcion para el movimiento del jugador
  function keyPressed() {
    if (keyCode == LEFT_ARROW) {
        jugador.move(-1)
    }
    if (keyCode == RIGHT_ARROW) {
        jugador.move(1)
    }
    //adicionalmente se agrega un boton para que se lanze la pelota
    if (key == ' ') {
        if (!bola.lanzada) {
            bola.xspeed = velBola * (random() < 0.5 ? 1 : -1)
            bola.yspeed = -velBola
            bola.lanzada = true
        }
    }
  }

  //funcion para que cuando no se presione ninguna tecla el jugador no se mueva
  function keyReleased() {
    jugador.move(0)
  }

  //muestra a informacion del jugador
  function mostrarInfo() {
    fill(255, 255, 255)
    textSize(14)
    text(`Putuacion: ${puntos}`, 20, 20)
    text(`Vidas: ${vidas}`, width - 80, 20)
    text(`Nivel: ${niveles}`, width / 2 - 20, 20)
  }

  function cargaNivel(n){
    cuadros = []
    infoNivel = getInfoNivel(n)
    let w = width/cols
    let h = 20

    for(let r = 0; r<infoNivel.length; r++) {
        for(let c = 0; c<infoNivel[r].length; c++) {
            let valor = infoNivel[r][c]
            if (valor != 0) {
                let x = c * w
                let y = r * h + 40
                let golpe = valor == 2 ? 3 : 1
                let irrompible = valor == 3
                cuadros.push(new Cuadro(x, y, w, h, golpe, irrompible))
            }
        }
    }

    //aqui esta las velocidades de los niveles
    velBola = n + 4
    //if (n == 2) velBola = 6
    //if (n == 3) velBola = 7
  }

  //funcion para reiniciar si se pierde
  function reinicio() {
    vidas = 3
    puntos = 0
    niveles = 1
    velBola = 5
    jugador = new Jugador()
    bola = new Bola()
    cargaNivel(niveles)
    loop()
  }

  class Jugador {
    constructor() {
        this.w = 100
        this.h = 15
        this.x = width / 2 - this.w / 2
        this.y = height - this.h - 10
        this.dir = 0
    }

    move(dir) {
        this.dir = dir
    }

    update() {
        this.x += this.dir * 7
        this.x = constrain(this.x, 0, width - this.w)
    }

    mostrar() {
        fill(255, 255, 255)
        rect(this.x, this.y, this.w, this.h)
    }
  }

  class Bola {
    constructor() {
        this.reset()
        this.lanzada = false
    }

    reset() {
        this.x = width / 2;
        this.y = height / 2;
        this.r = 10;
        this.xspeed = velBola * (random() < 0.5 ? 1 : -1)
        this.yspeed = - velBola
        this.lanzada = false
    }

    update() {
        if (!this.lanzada) return

        this.x += this.xspeed
        this.y += this.yspeed

        if (this.x < 0 || this.x > width) this.xspeed *= -1
        if (this.y < 0) this.yspeed *= -1
    }

    verificarJugador(jugador) {
        if (this.y + this.r > jugador.y && this.x > jugador.x && this.x < jugador.x + jugador.w) {
            this.y = jugador.y - this.r;
            this.yspeed *= -1;
    
            let centroJugador = jugador.x + jugador.w / 2;
            let distanciaDesdeCentro = (this.x - centroJugador) / (jugador.w / 2);
    
            this.xspeed = distanciaDesdeCentro * velBola;
        }
    }

    suelo() {
        if (this.y > height) {
            vidas--
            this.reset()
        }
    }

    golpe(cuadros) {
        if (this.x > cuadros.x && this.x < cuadros.x + cuadros.w && this.y > cuadros.y && this.y <cuadros.y+cuadros.h) {
            return true
        }
        return false
    }

    reverseY() {
        this.yspeed *=-1
    }

    mostrar() {
        fill(255, 255, 0);
        ellipse(this.x, this.y, this.r * 2);
    }
  }

  class Cuadro {
    constructor(x, y, w, h, golpe, irrompible) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.golpe = golpe;
        this.irrompible = irrompible;
      }

      mostrar() {
        if (this.irrompible) fill(58, 122, 154)
            else if (this.golpe == 3) fill (239, 171, 98)
        else if (this.golpe == 2) fill (228, 74, 42)
            else fill(255, 255, 255)
        rect(this.x, this.y, this.w, this.h)
      }
  }

  //aqui se accede a los niveles dependiendo en cual este y el mapa cambia
  function getInfoNivel(niveles) {
    if (niveles == 1) {
        return [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
        ];
    } else if (niveles == 2) {
        return [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 2, 2, 1, 1, 1, 1, 2, 2, 1],
            [0, 1, 1, 0, 0, 0, 0, 1, 1, 0],
        ]; 
    } else if (niveles == 3) {
        return [
            [2, 1, 1, 1, 1, 1, 1, 1, 1, 2],
            [2, 1, 1, 1, 1, 1, 1, 1, 1, 2],
            [1, 2, 1, 1, 1, 1, 1, 1, 2, 1],
            [0, 0, 1, 1, 3, 3, 1, 1, 0, 0]
        ];
    }
    return []
  }

  //Efecto para el diseño del juego
  function efectoRetro() {
    stroke(0, 0, 0, 50)
    for (let y = 0; y < height; y += 6) {
      line(0, y, width, y)
      line(0, y + 1, width, y + 1)
      line(0, y + 2, width, y + 2)
    }
  }