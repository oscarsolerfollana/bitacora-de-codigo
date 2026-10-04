// ============================================================
// app.js
// Lógica de la página principal (index.html).
//
// La página tiene dos partes:
//   - El listado de entradas (portada)
//   - Una entrada concreta, que se muestra cuando la dirección
//     termina en #/entrada/nombre-de-la-entrada
// ============================================================


// ---------- Variables con el estado de los filtros ----------
let textoBusqueda = "";
let categoriaElegida = "todas";
let ordenElegido = "recientes";

// Entrada que se está leyendo ahora mismo (o null si estamos en la portada)
let entradaActual = null;


// ============================================================
// 1. FUNCIONES PARA OBTENER DATOS
// ============================================================

// Devuelve todas las entradas: las escritas por el usuario + las de data.js
function obtenerEntradas() {
  let propias = leerDatos("entradas-propias", []);
  return propias.concat(POSTS);
}

// Busca una entrada por su "slug" (el nombre que aparece en la URL)
function buscarEntrada(slug) {
  let entradas = obtenerEntradas();
  for (let i = 0; i < entradas.length; i++) {
    if (entradas[i].slug === slug) {
      return entradas[i];
    }
  }
  return null;
}

// Calcula los minutos de lectura (unas 200 palabras por minuto)
function minutosLectura(entrada) {
  // Quitamos las etiquetas HTML para contar solo las palabras
  let texto = entrada.content.replace(/<[^>]+>/g, " ");
  let palabras = texto.split(" ").filter(function (p) {
    return p.trim() !== "";
  });
  return Math.ceil(palabras.length / 200);
}

// ¿Le ha dado el usuario a "me gusta" a esta entrada?
function tieneMeGusta(id) {
  let megusta = leerDatos("megusta", []);
  return megusta.includes(id);
}

// Número de "me gusta": los iniciales + 1 si el usuario le ha dado
function contarMeGusta(entrada) {
  let total = entrada.likesBase;
  if (tieneMeGusta(entrada.id)) {
    total = total + 1;
  }
  return total;
}

// Comentarios de una entrada
function obtenerComentarios(id) {
  let todos = leerDatos("comentarios", {});
  if (todos[id]) {
    return todos[id];
  }
  return [];
}


// ============================================================
// 2. LISTADO DE ENTRADAS (PORTADA)
// ============================================================

// Devuelve las entradas que cumplen la búsqueda y la categoría, ya ordenadas
function filtrarEntradas() {
  let entradas = obtenerEntradas();
  let resultado = [];
  let busqueda = textoBusqueda.toLowerCase().trim();

  for (let i = 0; i < entradas.length; i++) {
    let entrada = entradas[i];

    let cumpleCategoria = categoriaElegida === "todas" || entrada.category === categoriaElegida;

    // Buscamos en el título, el resumen y las etiquetas
    let dondeBuscar = (entrada.title + " " + entrada.excerpt + " " + entrada.tags.join(" ")).toLowerCase();
    let cumpleBusqueda = dondeBuscar.includes(busqueda);

    if (cumpleCategoria && cumpleBusqueda) {
      resultado.push(entrada);
    }
  }

  // Ordenar
  if (ordenElegido === "recientes") {
    resultado.sort(function (a, b) {
      return b.date.localeCompare(a.date);
    });
  } else if (ordenElegido === "antiguas") {
    resultado.sort(function (a, b) {
      return a.date.localeCompare(b.date);
    });
  } else if (ordenElegido === "populares") {
    resultado.sort(function (a, b) {
      return contarMeGusta(b) - contarMeGusta(a);
    });
  }

  return resultado;
}

// Crea el HTML de una tarjeta de entrada
function crearTarjeta(entrada) {
  let categoria = CATEGORIAS[entrada.category];
  let etiquetaPropia = "";
  if (entrada.propia) {
    etiquetaPropia = " · Tuya";
  }

  return `
    <article class="tarjeta">
      <a class="tarjeta__enlace" href="#/entrada/${entrada.slug}">
        <div class="portada-tarjeta portada-tarjeta--${categoria.color}">
          <span class="portada-tarjeta__glifo">${categoria.icono}</span>
        </div>
        <div class="tarjeta__cuerpo">
          <p class="etiqueta-cat etiqueta-cat--${categoria.color}">${categoria.nombre}${etiquetaPropia}</p>
          <h2 class="tarjeta__titulo">${escaparHTML(entrada.title)}</h2>
          <p class="tarjeta__resumen">${escaparHTML(entrada.excerpt)}</p>
        </div>
      </a>
      <footer class="tarjeta__pie">
        <span>${formatearFecha(entrada.date)} · ${minutosLectura(entrada)} min</span>
        <span>♥ ${contarMeGusta(entrada)} · 💬 ${obtenerComentarios(entrada.id).length}</span>
      </footer>
    </article>`;
}

// Pinta el listado completo en la página
function pintarListado() {
  let entradas = filtrarEntradas();
  let html = "";
  for (let i = 0; i < entradas.length; i++) {
    html = html + crearTarjeta(entradas[i]);
  }
  document.getElementById("rejilla").innerHTML = html;

  // Texto con el número de resultados
  let texto = entradas.length + " entradas";
  if (entradas.length === 1) {
    texto = "1 entrada";
  }
  document.getElementById("resultado").textContent = texto;

  // Mensaje si no hay resultados
  let vacio = document.getElementById("vacio");
  if (entradas.length === 0) {
    vacio.hidden = false;
  } else {
    vacio.hidden = true;
  }

  pintarPopulares();
  pintarEstadisticas();
}

// Barra lateral: las 3 entradas con más "me gusta"
function pintarPopulares() {
  let entradas = obtenerEntradas();
  entradas.sort(function (a, b) {
    return contarMeGusta(b) - contarMeGusta(a);
  });

  let html = "";
  for (let i = 0; i < 3 && i < entradas.length; i++) {
    html = html + `
      <li>
        <a href="#/entrada/${entradas[i].slug}">${escaparHTML(entradas[i].title)}</a>
        <span>♥ ${contarMeGusta(entradas[i])}</span>
      </li>`;
  }
  document.getElementById("populares").innerHTML = html;
}

// Números de la portada: entradas, minutos de lectura y comentarios
function pintarEstadisticas() {
  let entradas = obtenerEntradas();
  let minutos = 0;
  let comentarios = 0;

  for (let i = 0; i < entradas.length; i++) {
    minutos = minutos + minutosLectura(entradas[i]);
    comentarios = comentarios + obtenerComentarios(entradas[i].id).length;
  }

  document.getElementById("total-entradas").textContent = entradas.length;
  document.getElementById("total-minutos").textContent = minutos;
  document.getElementById("total-comentarios").textContent = comentarios;
}

// Al pulsar un botón de categoría
function elegirCategoria(boton) {
  categoriaElegida = boton.getAttribute("data-categoria");

  // Marcamos solo el botón pulsado
  let botones = document.querySelectorAll(".chip");
  for (let i = 0; i < botones.length; i++) {
    botones[i].classList.remove("activo");
  }
  boton.classList.add("activo");

  pintarListado();
}

// Botón "quitar los filtros" cuando no hay resultados
function limpiarFiltros() {
  textoBusqueda = "";
  document.getElementById("buscar").value = "";
  elegirCategoria(document.querySelector('[data-categoria="todas"]'));
}


// ============================================================
// 3. VISTA DE UNA ENTRADA
// ============================================================

function pintarEntrada(entrada) {
  let categoria = CATEGORIAS[entrada.category];

  // Etiquetas de la entrada
  let etiquetas = "";
  for (let i = 0; i < entrada.tags.length; i++) {
    etiquetas = etiquetas + `<span class="pildora">#${escaparHTML(entrada.tags[i])}</span>`;
  }

  // Autor
  let autor = "Óscar Soler";
  if (entrada.propia) {
    autor = "Escrita por ti";
  }

  // Botón de borrar, solo en las entradas escritas por el usuario
  let botonBorrar = "";
  if (entrada.propia) {
    botonBorrar = `<button class="btn btn--peligro" id="btn-borrar" type="button">Borrar entrada</button>`;
  }

  // Botón "me gusta" marcado o no
  let claseMeGusta = "";
  if (tieneMeGusta(entrada.id)) {
    claseMeGusta = " activo";
  }

  document.getElementById("vista-entrada").innerHTML = `
    <article class="entrada contenedor contenedor--estrecho">
      <a href="#/" class="volver">← Volver al listado</a>

      <header>
        <p class="etiqueta-cat etiqueta-cat--${categoria.color}">${categoria.nombre}</p>
        <h1 class="entrada__titulo">${escaparHTML(entrada.title)}</h1>
        <p class="entrada__meta">
          ${formatearFecha(entrada.date)} · ${minutosLectura(entrada)} min de lectura · ${autor}
        </p>
      </header>

      <div class="portada-tarjeta portada-tarjeta--grande portada-tarjeta--${categoria.color}">
        <span class="portada-tarjeta__glifo">${categoria.icono}</span>
      </div>

      <div class="entrada__contenido">${entrada.content}</div>

      <div class="entrada__etiquetas">${etiquetas}</div>

      <div class="acciones-entrada">
        <button class="btn btn--megusta${claseMeGusta}" id="btn-megusta" type="button">
          ♥ Me gusta <span id="numero-megusta">${contarMeGusta(entrada)}</span>
        </button>
        ${botonBorrar}
      </div>

      <section class="comentarios">
        <h2>Comentarios <span class="comentarios__n" id="numero-comentarios"></span></h2>
        <ol class="comentarios__lista" id="lista-comentarios"></ol>

        <form class="formulario formulario--comentario" id="form-comentario" novalidate>
          <h3>Deja un comentario</h3>
          <div class="campo">
            <label for="c-nombre">Nombre</label>
            <input id="c-nombre" type="text" maxlength="40">
            <p class="campo__error" id="c-nombre-error"></p>
          </div>
          <div class="campo">
            <label for="c-texto">Comentario <span class="contador" id="c-contador">0/500</span></label>
            <textarea id="c-texto" rows="4" maxlength="500"></textarea>
            <p class="campo__error" id="c-texto-error"></p>
          </div>
          <button class="btn btn--primario" type="submit">Publicar comentario</button>
        </form>
      </section>
    </article>`;

  pintarComentarios();

  // Ahora que los botones existen, les añadimos sus eventos
  document.getElementById("btn-megusta").addEventListener("click", alternarMeGusta);
  document.getElementById("form-comentario").addEventListener("submit", publicarComentario);
  document.getElementById("c-texto").addEventListener("input", contarCaracteres);
  if (entrada.propia) {
    document.getElementById("btn-borrar").addEventListener("click", borrarEntrada);
  }
}

// Dar o quitar "me gusta"
function alternarMeGusta() {
  let megusta = leerDatos("megusta", []);
  let boton = document.getElementById("btn-megusta");
  let posicion = megusta.indexOf(entradaActual.id);

  if (posicion === -1) {
    megusta.push(entradaActual.id);   // no estaba: lo añadimos
    boton.classList.add("activo");
  } else {
    megusta.splice(posicion, 1);      // ya estaba: lo quitamos
    boton.classList.remove("activo");
  }

  guardarDatos("megusta", megusta);
  document.getElementById("numero-megusta").textContent = contarMeGusta(entradaActual);
}

// Borrar una entrada escrita por el usuario
function borrarEntrada() {
  if (!confirm("¿Seguro que quieres borrar esta entrada?")) {
    return;
  }
  let propias = leerDatos("entradas-propias", []);
  let nuevas = [];
  for (let i = 0; i < propias.length; i++) {
    if (propias[i].id !== entradaActual.id) {
      nuevas.push(propias[i]);
    }
  }
  guardarDatos("entradas-propias", nuevas);
  mostrarMensaje("Entrada borrada");
  location.hash = "#/";
}


// ============================================================
// 4. COMENTARIOS
// ============================================================

function pintarComentarios() {
  let comentarios = obtenerComentarios(entradaActual.id);
  document.getElementById("numero-comentarios").textContent = "(" + comentarios.length + ")";

  let html = "";
  if (comentarios.length === 0) {
    html = `<li class="comentarios__vacio">Todavía no hay comentarios. ¡Sé el primero en opinar!</li>`;
  }

  for (let i = 0; i < comentarios.length; i++) {
    let c = comentarios[i];
    html = html + `
      <li class="comentario">
        <div class="comentario__avatar">${escaparHTML(c.nombre.charAt(0).toUpperCase())}</div>
        <div>
          <p class="comentario__cabecera"><strong>${escaparHTML(c.nombre)}</strong> <span>${c.fecha}</span></p>
          <p class="comentario__texto">${escaparHTML(c.texto)}</p>
          <button class="enlace enlace--pequeno" type="button" onclick="borrarComentario(${i})">Eliminar</button>
        </div>
      </li>`;
  }

  document.getElementById("lista-comentarios").innerHTML = html;
}

function contarCaracteres() {
  let largo = document.getElementById("c-texto").value.length;
  document.getElementById("c-contador").textContent = largo + "/500";
}

function publicarComentario(evento) {
  evento.preventDefault(); // que no se recargue la página

  let nombre = document.getElementById("c-nombre").value.trim();
  let texto = document.getElementById("c-texto").value.trim();

  // Validación
  limpiarErrores();
  let correcto = true;
  if (nombre.length < 2) {
    mostrarError("c-nombre", "Escribe tu nombre (mínimo 2 caracteres).");
    correcto = false;
  }
  if (texto.length < 5) {
    mostrarError("c-texto", "El comentario debe tener al menos 5 caracteres.");
    correcto = false;
  }
  if (!correcto) {
    return;
  }

  // Fecha de hoy en formato dd/mm/aaaa
  let hoy = new Date();
  let fecha = hoy.getDate() + "/" + (hoy.getMonth() + 1) + "/" + hoy.getFullYear();

  // Guardar
  let todos = leerDatos("comentarios", {});
  if (!todos[entradaActual.id]) {
    todos[entradaActual.id] = [];
  }
  todos[entradaActual.id].push({ nombre: nombre, texto: texto, fecha: fecha });
  guardarDatos("comentarios", todos);

  document.getElementById("c-texto").value = "";
  contarCaracteres();
  pintarComentarios();
  mostrarMensaje("¡Gracias por comentar!");
}

function borrarComentario(posicion) {
  let todos = leerDatos("comentarios", {});
  todos[entradaActual.id].splice(posicion, 1);
  guardarDatos("comentarios", todos);
  pintarComentarios();
  mostrarMensaje("Comentario eliminado");
}


// ============================================================
// 5. VALIDACIÓN DE FORMULARIOS
// ============================================================

// Muestra un error debajo de un campo y lo pinta en rojo
function mostrarError(idCampo, mensaje) {
  document.getElementById(idCampo).classList.add("error");
  document.getElementById(idCampo + "-error").textContent = mensaje;
}

// Borra todos los errores que haya en la página
function limpiarErrores() {
  let campos = document.querySelectorAll(".error");
  for (let i = 0; i < campos.length; i++) {
    campos[i].classList.remove("error");
  }
  let mensajes = document.querySelectorAll(".campo__error");
  for (let i = 0; i < mensajes.length; i++) {
    mensajes[i].textContent = "";
  }
}


// ============================================================
// 6. ESCRIBIR UNA NUEVA ENTRADA
// ============================================================

function abrirDialogo() {
  limpiarErrores();
  document.getElementById("dialogo-nueva").showModal();
}

function cerrarDialogo() {
  document.getElementById("dialogo-nueva").close();
}

function contarPalabras() {
  let texto = document.getElementById("n-contenido").value.trim();
  let palabras = 0;
  if (texto !== "") {
    palabras = texto.split(/\s+/).length;
  }
  document.getElementById("n-contador").textContent = palabras + " palabras";
  return palabras;
}

function publicarEntrada(evento) {
  evento.preventDefault();

  let titulo = document.getElementById("n-titulo").value.trim();
  let categoria = document.getElementById("n-categoria").value;
  let resumen = document.getElementById("n-resumen").value.trim();
  let contenido = document.getElementById("n-contenido").value.trim();
  let etiquetas = document.getElementById("n-etiquetas").value;

  // Validación
  limpiarErrores();
  let correcto = true;
  if (titulo.length < 5) {
    mostrarError("n-titulo", "El título debe tener al menos 5 caracteres.");
    correcto = false;
  }
  if (categoria === "") {
    mostrarError("n-categoria", "Elige una categoría.");
    correcto = false;
  }
  if (resumen.length < 10) {
    mostrarError("n-resumen", "El resumen debe tener al menos 10 caracteres.");
    correcto = false;
  }
  if (contarPalabras() < 20) {
    mostrarError("n-contenido", "Escribe al menos 20 palabras.");
    correcto = false;
  }
  if (!correcto) {
    return;
  }

  // Cada bloque separado por una línea en blanco será un párrafo
  let parrafos = contenido.split("\n\n");
  let html = "";
  for (let i = 0; i < parrafos.length; i++) {
    html = html + "<p>" + escaparHTML(parrafos[i]) + "</p>";
  }

  // Etiquetas: separadas por comas
  let listaEtiquetas = [];
  let trozos = etiquetas.split(",");
  for (let i = 0; i < trozos.length; i++) {
    let etiqueta = trozos[i].trim().toLowerCase();
    if (etiqueta !== "") {
      listaEtiquetas.push(etiqueta);
    }
  }
  if (listaEtiquetas.length === 0) {
    listaEtiquetas.push("personal");
  }

  // Fecha de hoy en formato aaaa-mm-dd (como las demás entradas)
  let hoy = new Date();
  let mes = String(hoy.getMonth() + 1).padStart(2, "0");
  let dia = String(hoy.getDate()).padStart(2, "0");

  // Usamos la hora actual en milisegundos como identificador único
  let id = "u" + Date.now();

  let nueva = {
    id: id,
    slug: "entrada-" + id,
    title: titulo,
    excerpt: resumen,
    category: categoria,
    tags: listaEtiquetas,
    date: hoy.getFullYear() + "-" + mes + "-" + dia,
    likesBase: 0,
    content: html,
    propia: true
  };

  // Guardar al principio de la lista
  let propias = leerDatos("entradas-propias", []);
  propias.unshift(nueva);
  guardarDatos("entradas-propias", propias);

  document.getElementById("form-nueva").reset();
  contarPalabras();
  cerrarDialogo();
  mostrarMensaje("¡Entrada publicada!");
  location.hash = "#/entrada/" + nueva.slug;
}


// ============================================================
// 7. CAMBIAR ENTRE PORTADA Y ENTRADA
// ============================================================
// Miramos la parte de la URL que va después de "#".
// Si es "#/entrada/algo", mostramos esa entrada. Si no, la portada.

function mostrarVista() {
  let hash = location.hash;
  entradaActual = null;

  if (hash.startsWith("#/entrada/")) {
    let slug = hash.replace("#/entrada/", "");
    entradaActual = buscarEntrada(slug);
  }

  if (entradaActual) {
    document.getElementById("vista-lista").hidden = true;
    document.getElementById("vista-entrada").hidden = false;
    document.title = entradaActual.title + " — Bitácora de Código";
    pintarEntrada(entradaActual);
    window.scrollTo(0, 0);
  } else {
    document.getElementById("vista-lista").hidden = false;
    document.getElementById("vista-entrada").hidden = true;
    document.title = "Bitácora de Código — Blog de desarrollo web";
    pintarListado();
  }
  actualizarBarraLectura();
}

// Barra de arriba que se llena según lo que llevas leído
function actualizarBarraLectura() {
  let barra = document.getElementById("progreso-lectura");
  if (entradaActual === null) {
    barra.style.width = "0%";
    return;
  }
  let alturaTotal = document.documentElement.scrollHeight - window.innerHeight;
  let porcentaje = (window.scrollY / alturaTotal) * 100;
  barra.style.width = porcentaje + "%";
}


// ============================================================
// 8. AL CARGAR LA PÁGINA
// ============================================================

document.addEventListener("DOMContentLoaded", function () {
  // Buscador: filtramos cada vez que el usuario escribe
  document.getElementById("buscar").addEventListener("input", function () {
    textoBusqueda = document.getElementById("buscar").value;
    pintarListado();
  });

  // Select de orden
  document.getElementById("orden").addEventListener("change", function () {
    ordenElegido = document.getElementById("orden").value;
    pintarListado();
  });

  // Botones de categoría
  let botones = document.querySelectorAll(".chip");
  for (let i = 0; i < botones.length; i++) {
    botones[i].addEventListener("click", function () {
      elegirCategoria(botones[i]);
    });
  }

  document.getElementById("btn-limpiar").addEventListener("click", limpiarFiltros);

  // Diálogo de nueva entrada
  document.getElementById("btn-nueva").addEventListener("click", abrirDialogo);
  document.getElementById("btn-cerrar").addEventListener("click", cerrarDialogo);
  document.getElementById("btn-cancelar").addEventListener("click", cerrarDialogo);
  document.getElementById("form-nueva").addEventListener("submit", publicarEntrada);
  document.getElementById("n-contenido").addEventListener("input", contarPalabras);

  // Cambio de vista cuando cambia el # de la URL
  window.addEventListener("hashchange", mostrarVista);
  window.addEventListener("scroll", actualizarBarraLectura);

  mostrarVista();
});
