document.addEventListener("DOMContentLoaded", () => {
  const frases = [
    "MTe diría que eres como una estrella, pero brillando sola… porque ninguna se compara a ti. ⭐",
    "Te diría que eres hermosa, como una estrella, pero mejor digo que eres hermosa como la luna, porque estrellas hay muchas y luna solo hay una. 🌸",
    "Nadie brilla como tú, y eso te hace única",
    "Me encanta tu voz",
    "Me encanta tu humor",
    "Me encantan tus ojos",
    "Simplemente me encanta todo de ti"
  ];

  let indice = 0;
  const contenedor = document.getElementById("contenedorFrase");
  const contador = document.getElementById("contador");
  const btn = document.getElementById("btnSiguiente");

  function mostrarFrase() {
    contenedor.textContent = frases[indice];
    contador.textContent = `${indice + 1} / ${frases.length}`;

    contenedor.classList.remove("aparecer");
    void contenedor.offsetWidth; // reinicia animación
    contenedor.classList.add("aparecer");
  }

  // mostrar la primera apenas carga
  mostrarFrase();

  btn.addEventListener("click", () => {
    indice++;
    if (indice >= frases.length) {
      indice = 0; // vuelve al inicio
    }
    mostrarFrase();
  });
});
