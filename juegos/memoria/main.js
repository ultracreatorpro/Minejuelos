const themes = {
    messi: ["imagenes/messi1.jpg","imagenes/messi1.jpg","imagenes/messi2.jpg","imagenes/messi2.jpg","imagenes/messi3.jpg","imagenes/messi3.jpg","imagenes/messi4.jpg","imagenes/messi4.jpg","imagenes/messi5.jpg","imagenes/messi5.jpg","imagenes/messi6.jpg","imagenes/messi6.jpg","imagenes/messi7.jpg","imagenes/messi7.jpg","imagenes/messi8.jpg","imagenes/messi8.jpg"],
    art: ["imagenes/painting1.jpg","imagenes/painting1.jpg","imagenes/painting2.jpg","imagenes/painting2.jpg","imagenes/painting3.jpg","imagenes/painting3.jpg","imagenes/painting4.jpg","imagenes/painting4.jpg","imagenes/painting5.jpg","imagenes/painting5.jpg","imagenes/painting6.jpg","imagenes/painting6.jpg","imagenes/painting7.jpg","imagenes/painting7.jpg","imagenes/painting8.jpg","imagenes/painting8.jpg"],
    musica: ["imagenes/cover1.jpg", "imagenes/cover1.jpg", "imagenes/cover2.jpg", "imagenes/cover2.jpg", "imagenes/cover3.jpg", "imagenes/cover3.jpg", "imagenes/cover4.jpg", "imagenes/cover4.jpg", "imagenes/cover5.jpg", "imagenes/cover5.jpg", "imagenes/cover6.jpg", "imagenes/cover6.jpg", "imagenes/cover7.jpg", "imagenes/cover7.jpg", "imagenes/cover8.jpg", "imagenes/cover8.jpg"]
};

function startGame(theme) { //no se puede empezar el juego sin haber seleccionado un tema, por eso el tema es un parámetro para empezar las funciones del juego
    const items = themes[theme];
    const shuffledItems = items.sort(() => (Math.random() > .5) ? 2 : -1);

    document.querySelector('.game').innerHTML = ''; // Limpiar el tablero de juego

    for(let i=0; i<items.length; i++){
        let box = document.createElement('div');
        box.className = 'item';

        // Verificar si es una imagen
        if (shuffledItems[i].includes('.jpg') || shuffledItems[i].includes('.png') || shuffledItems[i].includes('.jpeg')) {
            let img = document.createElement('img');
            img.src = shuffledItems[i];
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.display = 'none'; // Esconder la imagen hasta que se "gire" la carta
            box.appendChild(img);
        } else {
            // Si no es una imagen, es un emoji u otro texto
            box.innerHTML = shuffledItems[i];
        }

        box.onclick = function() {
            if (box.querySelector('img')) {
                box.querySelector('img').style.display = 'block'; // Mostrar la imagen si existe
            }
            this.classList.add('boxOpen');
            setTimeout(function() {
                if(document.querySelectorAll('.boxOpen').length > 1) {
                    let firstBox = document.querySelectorAll('.boxOpen')[0];
                    let secondBox = document.querySelectorAll('.boxOpen')[1];

                    if(firstBox.innerHTML == secondBox.innerHTML) {
                        firstBox.classList.add('boxMatch');
                        secondBox.classList.add('boxMatch');

                        firstBox.classList.remove('boxOpen');
                        secondBox.classList.remove('boxOpen');

                        if(document.querySelectorAll('.boxMatch').length == items.length) {
                            alert('Ganaste!!');
                        }
                    } else {
                        setTimeout(() => {
                            if (firstBox.querySelector('img')) {
                                firstBox.querySelector('img').style.display = 'none';
                            }
                            if (secondBox.querySelector('img')) {
                                secondBox.querySelector('img').style.display = 'none';
                            }
                            firstBox.classList.remove('boxOpen');
                            secondBox.classList.remove('boxOpen');
                        }, 500);
                    }
                }
            }, 500);
        }

        document.querySelector('.game').appendChild(box);
    }

    // Ocultar el selector de temas después de la selección
    document.getElementById('themeSelector').style.display = 'none';
}
