// ============================================================
// paginas.js
// Código de las páginas "Sobre mí" y "Contacto".
// Comprobamos qué elementos existen para saber en qué página estamos.
// ============================================================


// ---------- Sobre mí: barras de habilidades ----------
// Cada barra tiene su porcentaje en el atributo data-valor.
// Al cargar la página las rellenamos (el CSS hace la animación).

function rellenarBarras() {
  let barras = document.querySelectorAll(".habilidad__relleno");
  for (let i = 0; i < barras.length; i++) {
    let valor = barras[i].getAttribute("data-valor");
    barras[i].style.width = valor + "%";
  }
}


// ---------- Contacto: validar el formulario ----------

// Comprueba si un email tiene el formato texto@texto.texto
function emailValido(email) {
  let patron = /^\S+@\S+\.\S+$/;
  return patron.test(email);
}

function mostrarError(idCampo, mensaje) {
  document.getElementById(idCampo).classList.add("error");
  document.getElementById(idCampo + "-error").textContent = mensaje;
}

function quitarError(idCampo) {
  document.getElementById(idCampo).classList.remove("error");
  document.getElementById(idCampo + "-error").textContent = "";
}

function enviarContacto(evento) {
  evento.preventDefault(); // que no se recargue la página

  let nombre = document.getElementById("nombre").value.trim();
  let email = document.getElementById("email").value.trim();
  let motivo = document.getElementById("motivo").value;
  let mensaje = document.getElementById("mensaje").value.trim();
  let acepta = document.getElementById("privacidad").checked;

  let correcto = true;

  if (nombre.length < 2) {
    mostrarError("nombre", "Escribe tu nombre (mínimo 2 caracteres).");
    correcto = false;
  } else {
    quitarError("nombre");
  }

  if (!emailValido(email)) {
    mostrarError("email", "Introduce un correo válido, por ejemplo nombre@dominio.com.");
    correcto = false;
  } else {
    quitarError("email");
  }

  if (motivo === "") {
    mostrarError("motivo", "Elige un motivo.");
    correcto = false;
  } else {
    quitarError("motivo");
  }

  if (mensaje.length < 20) {
    mostrarError("mensaje", "El mensaje debe tener al menos 20 caracteres (llevas " + mensaje.length + ").");
    correcto = false;
  } else {
    quitarError("mensaje");
  }

  if (!acepta) {
    mostrarError("privacidad", "Debes aceptar la política de privacidad.");
    correcto = false;
  } else {
    quitarError("privacidad");
  }

  if (!correcto) {
    return;
  }

  // No hay servidor, así que simulamos el envío mostrando un resumen
  let selectMotivo = document.getElementById("motivo");
  let textoMotivo = selectMotivo.options[selectMotivo.selectedIndex].text;

  document.getElementById("exito").innerHTML = `
    <h2>¡Mensaje enviado!</h2>
    <p>Gracias, ${escaparHTML(nombre)}. Este es el resumen de tu mensaje:</p>
    <dl>
      <dt>Correo</dt><dd>${escaparHTML(email)}</dd>
      <dt>Motivo</dt><dd>${textoMotivo}</dd>
      <dt>Mensaje</dt><dd>${escaparHTML(mensaje)}</dd>
    </dl>
    <button class="btn btn--secundario" type="button" onclick="otroMensaje()">Enviar otro mensaje</button>`;

  document.getElementById("form-contacto").hidden = true;
  document.getElementById("exito").hidden = false;
  document.getElementById("form-contacto").reset();
  contarCaracteresMensaje();
}

// Volver a mostrar el formulario vacío
function otroMensaje() {
  document.getElementById("exito").hidden = true;
  document.getElementById("form-contacto").hidden = false;
}

function contarCaracteresMensaje() {
  let largo = document.getElementById("mensaje").value.length;
  document.getElementById("contador-mensaje").textContent = largo + "/1000";
}


// ---------- Al cargar la página ----------

document.addEventListener("DOMContentLoaded", function () {
  // Página "Sobre mí": esperamos un momento para que se vea la animación
  if (document.querySelector(".habilidad__relleno")) {
    setTimeout(rellenarBarras, 300);
  }

  // Página "Contacto"
  let formulario = document.getElementById("form-contacto");
  if (formulario) {
    formulario.addEventListener("submit", enviarContacto);
    document.getElementById("mensaje").addEventListener("input", contarCaracteresMensaje);
  }
});
