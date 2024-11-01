function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function drop(event) {
    event.preventDefault();
    var data = event.dataTransfer.getData("text");
    var element = document.getElementById(data);

    if (event.target.className === "box" && event.target.children.length === 0) {
        event.target.appendChild(element);
    }

    checkResults(); 
}

function checkResults() {
    const correctPositions = {
        0: "Tagliafico",
        1: "Reus",
        2: "Maguire"
    };

    let allCorrect = true;

    for (let i = 0; i < 3; i++) {
        let box = document.getElementById(i.toString());
        if (box.children.length === 0 || box.children[0].id !== correctPositions[i]) {
            allCorrect = false;
            break;
        }
    }

    if (allCorrect) {
        document.querySelector("h1").innerHTML = "MUY BIEN!!"
    } else if (Array.from(document.querySelectorAll('.box')).every(box => box.children.length > 0)) {
        document.querySelector("h1").innerHTML = "INTENTA DE NUEVO!!"
    }
}