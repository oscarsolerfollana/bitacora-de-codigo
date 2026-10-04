# Bitácora de Código

Blog personal sobre desarrollo web hecho con **HTML, CSS y JavaScript puro**, sin frameworks ni librerías externas. Actividad 1: creación de un blog.

## Cómo verlo

- **En línea:** https://TU-USUARIO.github.io/bitacora-de-codigo/
- **En local:** descarga la carpeta y abre `index.html` con doble clic. No necesita servidor ni instalar nada.

## Funcionalidades

- Listado de entradas con buscador, filtro por categoría y ordenación (recientes, antiguas, populares)
- Vista de cada entrada con su propia dirección (`#/entrada/nombre`) y barra de progreso de lectura
- Botón «Me gusta» y comentarios, guardados en `localStorage`
- Formulario para escribir nuevas entradas (se guardan en el navegador y se pueden borrar)
- Modo claro/oscuro que se recuerda entre visitas
- Páginas «Sobre mí» (barras de habilidades animadas) y «Contacto» (formulario con validación)
- Diseño adaptado a móvil (menú desplegable)

## Estructura

```
index.html        Portada + vista de una entrada
sobre-mi.html     Página «Sobre mí»
contacto.html     Formulario de contacto
css/styles.css    Todos los estilos (variables, tema oscuro, responsive)
js/common.js      Funciones compartidas: guardar datos, tema, menú, avisos
js/data.js        Entradas iniciales del blog
js/app.js         Lógica de la portada y las entradas
js/paginas.js     Lógica de «Sobre mí» y «Contacto»
```

## Publicar en GitHub Pages

1. Crea un repositorio en GitHub (por ejemplo `bitacora-de-codigo`) y sube estos archivos a la raíz.
2. Ve a **Settings → Pages**, elige **Deploy from a branch**, rama `main`, carpeta `/ (root)` y guarda.
3. En uno o dos minutos la web estará en `https://TU-USUARIO.github.io/bitacora-de-codigo/`.
