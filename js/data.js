// ============================================================
// data.js
// Entradas iniciales del blog. Como no hay servidor ni base de
// datos, las guardamos en un array de objetos.
// Las entradas que escribe el usuario se guardan aparte, en el
// navegador (localStorage), y se juntan con estas en app.js.
// ============================================================

// Categorías: nombre que se muestra, clase de color e icono de la portada
const CATEGORIAS = {
  html: { nombre: "HTML", color: "html", icono: "&lt;/&gt;" },
  css: { nombre: "CSS", color: "css", icono: "{ }" },
  js: { nombre: "JavaScript", color: "js", icono: "=&gt;" },
  herramientas: { nombre: "Herramientas", color: "tools", icono: "$_" },
  practicas: { nombre: "Buenas prácticas", color: "practices", icono: "✓" }
};

const POSTS = [
  {
    id: "p1",
    slug: "html-semantico",
    title: "HTML semántico: por qué <div> no lo es todo",
    excerpt:
      "Las etiquetas semánticas ayudan a buscadores, lectores de pantalla y a tu yo del futuro. Repasamos las más útiles y cuándo usarlas.",
    category: "html",
    tags: ["html", "accesibilidad", "seo"],
    date: "2026-09-28",
    likesBase: 24,
    content: `
<p>Cuando empezamos a maquetar es tentador resolverlo todo con <code>&lt;div&gt;</code> y clases. Funciona, sí, pero el navegador no sabe qué es cada bloque. El <strong>HTML semántico</strong> consiste en elegir la etiqueta que describe el significado del contenido, no su aspecto.</p>
<h2>Las etiquetas que más uso</h2>
<ul>
  <li><code>&lt;header&gt;</code> y <code>&lt;footer&gt;</code>: cabecera y pie de la página o de un artículo.</li>
  <li><code>&lt;nav&gt;</code>: bloques de navegación principales.</li>
  <li><code>&lt;main&gt;</code>: el contenido principal; solo debe haber uno por página.</li>
  <li><code>&lt;article&gt;</code>: contenido autónomo, como una entrada de blog.</li>
  <li><code>&lt;aside&gt;</code>: contenido relacionado pero secundario, como una barra lateral.</li>
</ul>
<pre><code>&lt;article&gt;
  &lt;header&gt;
    &lt;h1&gt;Título de la entrada&lt;/h1&gt;
    &lt;time datetime="2026-09-28"&gt;28 sep 2026&lt;/time&gt;
  &lt;/header&gt;
  &lt;p&gt;Contenido...&lt;/p&gt;
&lt;/article&gt;</code></pre>
<h2>¿Qué ganamos?</h2>
<p>Los lectores de pantalla permiten saltar directamente al <code>main</code> o recorrer los <code>nav</code>; los buscadores entienden mejor la jerarquía, y el código se lee casi como un esquema. Este mismo blog está construido así: si inspeccionas la página verás un <code>header</code>, un <code>main</code> con <code>article</code> y un <code>aside</code> lateral.</p>
<blockquote>Regla práctica: si dudas entre un <code>div</code> y una etiqueta semántica, pregúntate si un lector de pantalla debería anunciar ese bloque.</blockquote>`
  },
  {
    id: "p2",
    slug: "flexbox-vs-grid",
    title: "Flexbox vs. Grid: cuál usar en cada caso",
    excerpt:
      "No compiten: se complementan. Flexbox para una dimensión, Grid para dos. Lo vemos con ejemplos sacados de este mismo blog.",
    category: "css",
    tags: ["css", "layout", "responsive"],
    date: "2026-09-21",
    likesBase: 41,
    content: `
<p>Una de las dudas más frecuentes al aprender CSS es cuándo usar <strong>Flexbox</strong> y cuándo <strong>Grid</strong>. La respuesta corta: Flexbox organiza elementos en <em>una</em> dimensión (fila o columna) y Grid en <em>dos</em> (filas y columnas a la vez).</p>
<h2>Flexbox: alinear cosas en una línea</h2>
<p>La barra de navegación de este blog es un ejemplo perfecto: unos cuantos enlaces en fila, separados y centrados verticalmente.</p>
<pre><code>.nav {
  display: flex;
  align-items: center;
  gap: 1rem;
}</code></pre>
<h2>Grid: la rejilla de tarjetas</h2>
<p>El listado de entradas usa Grid con <code>auto-fill</code> y <code>minmax()</code>. Así el número de columnas se adapta solo al ancho de la pantalla, sin una sola media query:</p>
<pre><code>.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}</code></pre>
<h2>Mi regla</h2>
<p>Si piensas en el contenido («quiero que estos botones se repartan el espacio»), Flexbox. Si piensas en la estructura («quiero una rejilla de 3 columnas con una barra lateral»), Grid. Y nada impide anidarlos: una celda de Grid puede ser un contenedor Flex.</p>`
  },
  {
    id: "p3",
    slug: "closures-javascript",
    title: "Closures en JavaScript explicados sin dolor",
    excerpt:
      "Una función que recuerda el lugar donde nació. Parece magia, pero es uno de los conceptos más útiles del lenguaje.",
    category: "js",
    tags: ["javascript", "funciones", "fundamentos"],
    date: "2026-09-14",
    likesBase: 33,
    content: `
<p>Un <strong>closure</strong> (clausura) es una función que conserva acceso a las variables del ámbito en el que se creó, incluso cuando ese ámbito ya ha terminado de ejecutarse.</p>
<pre><code>function crearContador() {
  let cuenta = 0;
  return function () {
    cuenta++;
    return cuenta;
  };
}

const contador = crearContador();
contador(); // 1
contador(); // 2</code></pre>
<p>La variable <code>cuenta</code> no es accesible desde fuera, pero la función devuelta la «recuerda». Es una forma sencilla de tener <strong>estado privado</strong>.</p>
<h2>Un uso real: un contador de clics</h2>
<p>Los closures son útiles cuando queremos que una función «recuerde» un dato entre llamadas sin usar una variable global:</p>
<pre><code>function crearBoton(nombre) {
  let clics = 0;
  return function () {
    clics++;
    console.log(nombre + " pulsado " + clics + " veces");
  };
}

const alPulsar = crearBoton("Enviar");
alPulsar(); // Enviar pulsado 1 veces
alPulsar(); // Enviar pulsado 2 veces</code></pre>
<p>Cada botón creado así tiene su propio contador, y nadie desde fuera puede modificarlo por error.</p>`
  },
  {
    id: "p4",
    slug: "accesibilidad-web-basica",
    title: "Accesibilidad web: 7 mejoras que puedes hacer hoy",
    excerpt:
      "Textos alternativos, contraste, foco visible... Pequeños cambios que hacen que tu web sea usable por muchas más personas.",
    category: "practicas",
    tags: ["accesibilidad", "html", "usabilidad"],
    date: "2026-09-07",
    likesBase: 29,
    content: `
<p>La accesibilidad no es un extra para el final del proyecto: es parte de la calidad. Estas son siete mejoras rápidas que he aplicado en este blog.</p>
<ol>
  <li><strong>Texto alternativo</strong> en todas las imágenes con información (<code>alt</code>).</li>
  <li><strong>Contraste suficiente</strong> entre texto y fondo (mínimo 4,5:1 para texto normal).</li>
  <li><strong>Foco visible</strong>: nunca pongas <code>outline: none</code> sin una alternativa.</li>
  <li><strong>Etiquetas en los formularios</strong>: cada <code>input</code> con su <code>label</code>.</li>
  <li><strong>Enlace «Saltar al contenido»</strong> para quien navega con teclado.</li>
  <li><strong>Botones de verdad</strong>: si hace algo, usa <code>&lt;button&gt;</code>, no un <code>div</code> con <code>onclick</code>.</li>
  <li><strong>Respetar <code>prefers-reduced-motion</code></strong> para quien desactiva las animaciones.</li>
</ol>
<pre><code>@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}</code></pre>
<p>Prueba a recorrer tu web solo con el tabulador. Si te pierdes, tus usuarios también.</p>`
  },
  {
    id: "p5",
    slug: "git-para-empezar",
    title: "Git para empezar: los 8 comandos que de verdad usas",
    excerpt:
      "Olvídate de memorizar cien comandos. Con estos ocho cubres el 90 % del trabajo diario y puedes publicar tu web en GitHub Pages.",
    category: "herramientas",
    tags: ["git", "github", "despliegue"],
    date: "2026-08-31",
    likesBase: 37,
    content: `
<p>Git puede intimidar, pero el día a día se resume en unos pocos comandos:</p>
<pre><code>git init                 # crea un repositorio
git status               # qué ha cambiado
git add .                # prepara los cambios
git commit -m "mensaje"  # guarda una versión
git log --oneline        # historial resumido
git branch nueva-rama    # crea una rama
git switch nueva-rama    # cambia de rama
git push origin main     # sube los cambios a GitHub</code></pre>
<h2>Publicar con GitHub Pages</h2>
<p>Este blog está publicado así: subes el repositorio a GitHub, vas a <em>Settings → Pages</em>, eliges la rama <code>main</code> y la carpeta raíz, y en un minuto tienes la web en <code>https://usuario.github.io/repositorio/</code>. Como es HTML, CSS y JS puro, no hace falta ningún paso de compilación.</p>
<blockquote>Consejo: haz commits pequeños y con mensajes que expliquen el <em>porqué</em>, no solo el <em>qué</em>.</blockquote>`
  },
  {
    id: "p6",
    slug: "localstorage-persistencia",
    title: "localStorage: persistencia sin servidor",
    excerpt:
      "Cómo este blog recuerda tus «me gusta», comentarios y el modo oscuro sin una base de datos. Ventajas, límites y trampas.",
    category: "js",
    tags: ["javascript", "almacenamiento", "dom"],
    date: "2026-08-24",
    likesBase: 22,
    content: `
<p><code>localStorage</code> es un almacén clave-valor del navegador que persiste aunque cierres la pestaña. Solo guarda <strong>texto</strong>, así que para objetos usamos JSON:</p>
<pre><code>const likes = { p1: true, p3: true };
localStorage.setItem("likes", JSON.stringify(likes));

const leidos = JSON.parse(localStorage.getItem("likes")) || {};</code></pre>
<h2>Trampas habituales</h2>
<ul>
  <li>Puede lanzar excepciones (modo privado, cuota llena): envuélvelo en <code>try/catch</code>.</li>
  <li>Es <strong>por navegador y por dominio</strong>: otros usuarios no ven tus datos.</li>
  <li>Nunca guardes contraseñas ni datos sensibles.</li>
  <li>Al pintar en la página texto que escribió el usuario, <strong>escápalo</strong> para evitar inyección de HTML (XSS).</li>
</ul>
<p>En este blog, los comentarios se escapan antes de insertarse en el DOM. Prueba a escribir <code>&lt;b&gt;hola&lt;/b&gt;</code> en un comentario: verás el texto tal cual, no en negrita.</p>`
  },
  {
    id: "p7",
    slug: "responsive-mobile-first",
    title: "Diseño responsive con enfoque mobile first",
    excerpt:
      "Empezar por la pantalla pequeña obliga a priorizar. Unidades relativas, media queries con min-width e imágenes flexibles.",
    category: "css",
    tags: ["css", "responsive", "usabilidad"],
    date: "2026-08-17",
    likesBase: 18,
    content: `
<p><strong>Mobile first</strong> significa escribir primero los estilos para móvil y añadir mejoras para pantallas grandes con <code>min-width</code>. El CSS base queda más simple y el móvil no descarga reglas que no necesita.</p>
<pre><code>/* Base: móvil, una columna */
.layout { display: grid; gap: 2rem; }

/* A partir de 960px: contenido + barra lateral */
@media (min-width: 960px) {
  .layout { grid-template-columns: 1fr 300px; }
}</code></pre>
<h2>Tres hábitos que ayudan</h2>
<ul>
  <li>Usa <code>rem</code> para tipografía y espacios: respetan el tamaño de letra del usuario.</li>
  <li>Pon <code>max-width: 100%</code> a imágenes y vídeos.</li>
  <li>Prueba en un móvil real, no solo en el emulador: el pulgar no es un ratón.</li>
</ul>
<p>Encoge la ventana del navegador en este blog: el menú se convierte en un botón y la barra lateral baja debajo del contenido.</p>`
  },
  {
    id: "p8",
    slug: "fetch-async-await",
    title: "fetch y async/await: pedir datos sin bloquear",
    excerpt:
      "Las peticiones a una API tardan. Con async/await el código asíncrono se lee como si fuera secuencial, y gestionar errores es más fácil.",
    category: "js",
    tags: ["javascript", "asincronía", "api"],
    date: "2026-08-10",
    likesBase: 27,
    content: `
<p>JavaScript no espera de brazos cruzados a que llegue una respuesta de red: sigue ejecutando y nos avisa cuando hay datos. Con <code>async/await</code> ese código se escribe de forma muy legible:</p>
<pre><code>async function cargarUsuarios() {
  try {
    const res = await fetch("https://api.ejemplo.com/usuarios");
    if (!res.ok) throw new Error("HTTP " + res.status);
    const datos = await res.json();
    pintar(datos);
  } catch (err) {
    mostrarError("No se pudieron cargar los usuarios");
  }
}</code></pre>
<h2>Detalles importantes</h2>
<ul>
  <li><code>fetch</code> <strong>no</strong> lanza error con un 404 o 500: hay que comprobar <code>res.ok</code>.</li>
  <li>Muestra un estado de carga mientras esperas: el usuario debe saber que algo pasa.</li>
  <li>Si una función usa <code>await</code>, debe declararse <code>async</code>.</li>
</ul>
<p>Este blog no usa <code>fetch</code> (no hay backend), pero es el siguiente paso natural: sustituir el array de entradas por una llamada a una API.</p>`
  }
];
