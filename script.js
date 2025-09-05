/* ==== PINTAR ==== */
const canvas = document.getElementById("canvas");
if (canvas) {
  const ctx = canvas.getContext("2d");
  let pintando = false;

  canvas.addEventListener("touchstart", e => {
    pintando = true;
    dibujar(e.touches[0]);
  });
  canvas.addEventListener("touchmove", e => {
    if (pintando) dibujar(e.touches[0]);
  });
  canvas.addEventListener("touchend", () => pintando = false);

  function dibujar(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.fillStyle = document.getElementById("color").value;
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  window.limpiarCanvas = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };
}

document.addEventListener("DOMContentLoaded", () => {
  const puzzle = document.getElementById("puzzle");
  if (!puzzle) return;

  // 1) Generar automáticamente las 9 piezas con su data-pos
  if (puzzle.children.length === 0) {
    for (let i = 1; i <= 9; i++) {
      const d = document.createElement("div");
      d.className = "pieza";
      d.setAttribute("draggable", "true");   // desktop
      d.dataset.pos = String(i);             // slice de imagen
      puzzle.appendChild(d);
    }
  }

  // 2) Mezclar al cargar
  function mezclar() {
    const piezas = Array.from(puzzle.children);
    piezas.sort(() => Math.random() - 0.5);
    piezas.forEach(p => puzzle.appendChild(p));
  }
  mezclar();
  window.reiniciarPuzzle = mezclar;

  // 3) Intercambio común
  function intercambiar(p1, p2) {
    if (!p1 || !p2 || p1 === p2) return;
    const temp = document.createElement("div");
    p1.replaceWith(temp);
    p2.replaceWith(p1);
    temp.replaceWith(p2);
    verificarCompletado();
  }

  // 4) Desktop: drag & drop nativo
  let piezaArrastrada = null;

  puzzle.addEventListener("dragstart", e => {
    if (e.target.classList.contains("pieza")) {
      piezaArrastrada = e.target;
      piezaArrastrada.classList.add("sujeta");
      setTimeout(() => piezaArrastrada.classList.add("invisible"), 50);
    }
  });

  puzzle.addEventListener("dragend", () => {
    if (piezaArrastrada) piezaArrastrada.classList.remove("sujeta", "invisible");
    piezaArrastrada = null;
  });

  puzzle.addEventListener("dragover", e => e.preventDefault());

  puzzle.addEventListener("drop", e => {
    const objetivo = e.target;
    if (objetivo.classList.contains("pieza") && piezaArrastrada) {
      intercambiar(objetivo, piezaArrastrada);
    }
  });

  // 5) Móvil: touch (soporta iOS/Android)
  let piezaTocada = null;

  puzzle.addEventListener("touchstart", e => {
    const t = e.target;
    if (t.classList.contains("pieza")) {
      piezaTocada = t;
      piezaTocada.classList.add("sujeta");
    }
  }, { passive: true });

  // Evita scroll del documento mientras “arrastras”
  puzzle.addEventListener("touchmove", e => {
    if (piezaTocada) e.preventDefault();
  }, { passive: false });

  puzzle.addEventListener("touchend", e => {
    if (!piezaTocada) return;
    const touch = e.changedTouches[0];
    const debajo = document.elementFromPoint(touch.clientX, touch.clientY);
    if (debajo && debajo.classList.contains("pieza")) {
      intercambiar(debajo, piezaTocada);
    }
    piezaTocada.classList.remove("sujeta");
    piezaTocada = null;
  });

  // 6) Verificar si está completo (1..9 en orden)
  function verificarCompletado() {
    const orden = Array.from(puzzle.children).map(n => n.dataset.pos).join(",");
    if (orden === "1,2,3,4,5,6,7,8,9") {
      // Mensaje romántico simple (puedes cambiar por un modal bonito)
      setTimeout(() => alert("¡Lo lograste, Valeria! 💖"), 100);
    }
  }
});

