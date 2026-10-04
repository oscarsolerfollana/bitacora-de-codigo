// ============================================================
// common.js
// Funciones que usan todas las páginas del blog:
// guardar datos, modo oscuro, menú del móvil, botón de subir
// y mensajes emergentes.
// ============================================================


// ---------- Guardar y leer datos en el navegador ----------
// localStorage solo guarda texto, así que convertimos los
// objetos a texto con JSON.stringify y al revés con JSON.parse.

function leerDatos(clave, valorPorDefecto) {
  let texto = localStorage.getItem(clave);
  if (texto === null) {
    return valorPorDefecto;
  }
  return JSON.parse(texto);
}

function guardarDatos(clave, valor) {
  localStorage.setItem(clave, JSON.stringify(valor));
}


// ---------- Evitar que el usuario meta HTML ----------
// Si alguien escribe <b>hola</b> en un comentario, queremos que
// se vea tal cual y no en negrita (ni que pueda meter código).

function escaparHTML(texto) {
  texto = texto.replaceAll("&", "&amp;");
  texto = texto.replaceAll("<", "&lt;");
  texto = texto.replaceAll(">", "&gt;");
  texto = texto.replaceAll('"', "&quot;");
  return texto;
}


// ---------- Formatear fechas ----------
// Convierte "2026-09-28" en "28 de septiembre de 2026"

const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio",
  "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

function formatearFecha(fecha) {
  let partes = fecha.split("-"); // ["2026", "09", "28"]
  let anio = partes[0];
  let mes = MESES[Number(partes[1]) - 1];
  let dia = Number(partes[2]);
  return dia + " de " + mes + " de " + anio;
}


// ---------- Mensaje emergente (toast) ----------
// Muestra un aviso abajo de la pantalla durante 3 segundos.

function mostrarMensaje(texto) {
  let aviso = document.createElement("div");
  aviso.className = "toast";
  aviso.textContent = texto;
  document.body.appendChild(aviso);

  setTimeout(function () {
    aviso.remove();
  }, 3000);
}


// ---------- Modo claro / oscuro ----------
// Guardamos el tema elegido para que se mantenga al volver.

function ponerTema(tema) {
  document.documentElement.setAttribute("data-theme", tema);
  localStorage.setItem("tema", tema); // es solo un texto, no hace falta JSON
}

function cambiarTema() {
  let temaActual = document.documentElement.getAttribute("data-theme");
  if (temaActual === "oscuro") {
    ponerTema("claro");
  } else {
    ponerTema("oscuro");
  }
}


// ---------- Menú en el móvil ----------
// En pantallas pequeñas el menú se abre y cierra con un botón.

function abrirCerrarMenu() {
  let menu = document.getElementById("menu-principal");
  menu.classList.toggle("abierto");
}


// ---------- Botón "volver arriba" ----------
// Aparece cuando el usuario ha bajado bastante en la página.

function revisarBotonArriba() {
  let boton = document.getElementById("btn-arriba");
  if (window.scrollY > 500) {
    boton.classList.add("visible");
  } else {
    boton.classList.remove("visible");
  }
}

function subirArriba() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}


// ---------- Al cargar la página ----------

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("btn-tema").addEventListener("click", cambiarTema);
  document.getElementById("btn-menu").addEventListener("click", abrirCerrarMenu);
  document.getElementById("btn-arriba").addEventListener("click", subirArriba);
  window.addEventListener("scroll", revisarBotonArriba);

  // Año actual en el pie de página
  document.getElementById("anio").textContent = new Date().getFullYear();
});
