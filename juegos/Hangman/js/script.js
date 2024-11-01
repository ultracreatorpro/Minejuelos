// Obtener los elementos del DOM
const Cuerpo = document.querySelector(".hangman-box img");
const PalabraIniciada = document.querySelector(".word-display");
const Textoadivinado = document.querySelector(".guesses-text b");
const keyboardDiv = document.querySelector('.keyboard');
const ModeloDelJuego = document.querySelector(".game-modal");
const botonDeReinicio = document.querySelector(".play-again");

let palabraactual, PalabrasCorrectas = [], PuntosIncorrectos = 0;
const MaximoPuntos = 6;

const Reiniciar = () => {
    PalabrasCorrectas = [];
    PuntosIncorrectos = 0;
    Cuerpo.src = `img/hangman-${PuntosIncorrectos}.svg`;
    Textoadivinado.innerText = `${PuntosIncorrectos} / ${MaximoPuntos}`;
    keyboardDiv.querySelectorAll("button").forEach(btn => btn.disabled = false);
    PalabraIniciada.innerHTML = palabraactual.split("").map(() => ` <li class="letter"></li>`).join("");
    ModeloDelJuego.classList.remove("show");
};


const getRandomWord = () => {
    const { word, hint } = wordList[Math.floor(Math.random() * wordList.length)];
    palabraactual = word;
    document.querySelector(".hint-text b").innerText = hint;
    Reiniciar();
};


const gameOver = (Victoria) => {
    setTimeout(() => {
        const ModeloDeTexto = Victoria ? `Encontraste la palabra:` : `La palabra correcta era:`;
        ModeloDelJuego.querySelector("img").src = `img/${Victoria ? 'victory' : 'lost'}.gif`;
        ModeloDelJuego.querySelector("h4").innerText = `${Victoria ? 'Felicitaciones' : 'Game Over!'}`;
        ModeloDelJuego.querySelector("p").innerHTML = `${ModeloDeTexto} <b>${palabraactual}</b>`;
        ModeloDelJuego.classList.add("show");
    }, 300);
};


const initgame = (button, clickedLetter) => {
    if (palabraactual.includes(clickedLetter)) {
        [...palabraactual].forEach((letter, index) => {
            if (letter === clickedLetter) {
                PalabrasCorrectas.push(letter);
                PalabraIniciada.querySelectorAll("li")[index].innerText = letter;
                PalabraIniciada.querySelectorAll("li")[index].classList.add("guessed");
            }
        });
    } else {
        PuntosIncorrectos++;
        Cuerpo.src = `img/hangman-${PuntosIncorrectos}.svg`;
    }
    button.disabled = true;
    Textoadivinado.innerText = `${PuntosIncorrectos} / ${MaximoPuntos}`;

    if (PuntosIncorrectos === MaximoPuntos) return gameOver(false);
    if (PalabrasCorrectas.length === palabraactual.length) return gameOver(true);
};

const buttons = [];
for (let i = 97; i <= 122; i++) {
    const button = document.createElement("button");
    button.innerText = String.fromCharCode(i);
    keyboardDiv.appendChild(button);
    button.addEventListener("click", e => initgame(e.target, e.target.innerText));
    buttons.push(button);
}


getRandomWord();

botonDeReinicio.addEventListener("click", getRandomWord);


window.addEventListener("keydown", (e) => {
    const pressedkey = e.key.toLowerCase();
    if(/^[a-z]$/.test(pressedkey)){
        const button = Array.from(keyboardDiv.querySelectorAll("button")).find((btn)=> btn.innerText.toLowerCase()=== pressedkey && !btn.disabled);
        if(button){
            initgame(button,pressedkey);
        }
    }
});
