const puzzle = document.getElementById("puzzle");
const mensaje = document.getElementById("mensaje");

// Lista de imágenes del rompecabezas
const imagenes = ["corona.png", "vestido.png", "foto.jpeg"];
let nivel = 0;

function iniciarPuzzle() {
  puzzle.innerHTML = "";
  const piezas = [];

  for (let i = 0; i < 9; i++) {
    const pieza = document.createElement("div");
    pieza.classList.add("pieza");
    pieza.style.backgroundImage = `url(${imagenes[nivel]})`;
    pieza.style.backgroundSize = "300px 300px";
    pieza.style.backgroundPosition = `-${(i % 3) * 100}px -${Math.floor(i / 3) * 100}px`;
    pieza.dataset.index = i;
    piezas.push(pieza);
  }

  // Mezclar piezas
  piezas.sort(() => Math.random() - 0.5);
  piezas.forEach(p => puzzle.appendChild(p));

  agregarEventos();
}

function agregarEventos() {
  const piezas = document.querySelectorAll(".pieza");
  let piezaSeleccionada = null;

  piezas.forEach(pieza => {
    // PC: click
    pieza.addEventListener("click", () => {
      if (!piezaSeleccionada) {
        piezaSeleccionada = pieza;
        pieza.classList.add("seleccionada");
      } else {
        // Intercambiar posiciones
        const temp = document.createElement("div");
        puzzle.insertBefore(temp, piezaSeleccionada);
        puzzle.insertBefore(piezaSeleccionada, pieza);
        puzzle.insertBefore(pieza, temp);
        puzzle.removeChild(temp);

        piezaSeleccionada.classList.remove("seleccionada");
        piezaSeleccionada = null;

        verificarPuzzle();
      }
    });

    // Móvil: touch
    pieza.addEventListener("touchstart", e => {
      e.preventDefault();
      if (!piezaSeleccionada) {
        piezaSeleccionada = pieza;
        pieza.classList.add("seleccionada");
      } else {
        const temp = document.createElement("div");
        puzzle.insertBefore(temp, piezaSeleccionada);
        puzzle.insertBefore(piezaSeleccionada, pieza);
        puzzle.insertBefore(pieza, temp);
        puzzle.removeChild(temp);

        piezaSeleccionada.classList.remove("seleccionada");
        piezaSeleccionada = null;

        verificarPuzzle();
      }
    });
  });
}

function verificarPuzzle() {
  const piezas = document.querySelectorAll(".pieza");
  let correcto = true;

  piezas.forEach((pieza, i) => {
    if (parseInt(pieza.dataset.index) !== i) {
      correcto = false;
    }
  });

  if (correcto) {
    nivel++;
    if (nivel < imagenes.length) {
      mensaje.textContent = "¡Muy bien! 🎉 Ahora vamos con el siguiente nivel...";
      setTimeout(() => {
        iniciarPuzzle();
      }, 2000);
    } else {
      mostrarFinal();
    }
  }
}

function mostrarFinal() {
  puzzle.innerHTML = "";
  mensaje.textContent = "";

  // Crear contenedor de carga
  const loader = document.createElement("div");
  loader.id = "loader";
  loader.innerHTML = `
    <div id="progress">0%</div>
    <div class="bar"><div class="fill"></div></div>
  `;
  puzzle.appendChild(loader);

  let porcentaje = 0;
  const interval = setInterval(() => {
    porcentaje++;
    document.getElementById("progress").textContent = porcentaje + "%";
    document.querySelector(".fill").style.width = porcentaje + "%";

    if (porcentaje >= 100) {
      clearInterval(interval);
      // Animación de brillo
      loader.classList.add("flash");

      setTimeout(() => {
        loader.remove();

        // Corazones flotando
        const corazones = document.createElement("div");
        corazones.classList.add("corazones");
        puzzle.appendChild(corazones);

        setInterval(() => {
          const heart = document.createElement("div");
          heart.classList.add("heart");
          heart.textContent = "💖";
          heart.style.left = Math.random() * 100 + "%";
          corazones.appendChild(heart);

          setTimeout(() => heart.remove(), 4000);
        }, 500);

        // Imagen final con brillos
        const imgFinal = document.createElement("img");
        imgFinal.src = "princesa.png"; // 👉 tu foto final
        imgFinal.style.width = "300px";
        imgFinal.style.borderRadius = "15px";
        imgFinal.classList.add("revelada");

        puzzle.appendChild(imgFinal);
        mensaje.textContent = "✨👑 Felicidades Valeria 👑✨ ¡La princesa más especial! 💖";
      }, 2000);
    }
  }, 40); // velocidad de carga
}

// 👑 Arranca el primer puzzle cuando la página cargue
window.onload = () => {
  mensaje.textContent = "👑 ¿Lista para armar a una princesa? 👑";
  iniciarPuzzle();
};
