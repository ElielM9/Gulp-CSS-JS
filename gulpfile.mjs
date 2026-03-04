/* Importar funciones de gulp */
import gulp from "gulp";
const { src, dest, watch, parallel, series } = gulp;

//Plugins HTML
import htmlMin from "gulp-htmlmin"; // Minifica HTML

//Plugins para CSS
import postcss from "gulp-postcss"; // Procesa CSS con PostCSS
import autoprefixer from "autoprefixer"; // Agrega prefijos de proveedores a las reglas de CSS
import cssnano from "cssnano"; // Minifica CSS
import clean from "gulp-purgecss"; // Limpia estilos CSS no usados

// Plugins para JS
import terser from "gulp-terser"; // Minifica JavaScript
// import babel from "gulp-babel"; // Transpila JavaScript con Babel (OPCIONAL)

//Plugins para imágenes
import imgMin from "gulp-imagemin"; // Optimiza imágenes
import cache from "gulp-cache"; // Cachea imágenes optimizadas para evitar procesar las mismas imágenes varias veces
import webp from "gulp-webp"; // Convierte imágenes a formato WebP
import avif from "gulp-avif"; // Convierte imágenes a formato AVIF

// Plugins extra
import plumber from "gulp-plumber"; // Maneja errores sin detener el proceso de Gulp
import concat from "gulp-concat"; // Concatena archivos en uno solo
import cacheBust from "gulp-cache-bust"; // Agrega una marca de tiempo a los archivos para evitar problemas de caché
import sourcemaps from "gulp-sourcemaps"; // Genera sourcemaps para facilitar la depuración de código minificado
import browserSync from "browser-sync"; // Crea un servidor de desarrollo y recarga el navegador automáticamente cuando los archivos cambian

const bs = browserSync.create(); // Crea una instancia de BrowserSync

// Funciones

export function browserServer(done) {
  bs.init({
    server: {
      baseDir: "./public",
    },
  });

  done();
}

/** HTML
 * Toma todos los archivos HTML en la carpeta `src/views`, las minimiza, agrega una marca de tiempo al nombre del archivo, y los envía a la carpeta `public`
 * @param done - Esta es una función callback que le dice a gulp cuando la tarea se completó.
 */
export function html(done) {
  const options = {
    collapseWhitespace: true,
    removeComments: true,
  };
  const cache = {
    type: `timestamp`,
  };

  src("src/views/**/*.html")
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(htmlMin(options))
    .pipe(cacheBust(cache))
    .pipe(sourcemaps.write(`.`))
    .pipe(dest("public/"))
    .pipe(bs.stream()); // Recarga el navegador automáticamente cuando los archivos HTML cambian

  done();
}

/** CSS
 * Toma todos los archivos CSS en la carpetasrc/styles, los concatena en un solo archivo styles.css, agrega prefijos de proveedores  a las reglas de CSS, minifica, y escribe un sourcemap en la carpeta public/styles
 * @param done - Es una función callback que indica a gulp cuando la tarea terminó.
 */
export function css(done) {
  src(`src/styles/**/*.css`)
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(concat(`styles.css`))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write(`.`))
    .pipe(dest(`public/styles`))
    .pipe(bs.stream()); // Recarga el navegador automáticamente cuando los archivos CSS cambian

  done();
}

/**
 * Esta función limpia los estilos que no se usan
 * @param done - Es una función callback que indica a gulp cuando la tarea terminó.
 */
export function cleanCSS(done) {
  const content = {
    content: [`public/*.html`],
  };

  src(`public/styles/styles.css`)
    .pipe(clean(content))
    .pipe(dest(`public/styles`));

  done();
}

/** JS
 * Minifica y genera sourcemaps para todos los archivos JS en `src/js` y los pasa a `public/js`.
 */
export function javaScript(done) {
  /*   const options = {
    presets: ["@babel/preset-env"],
  }; */

  src(`src/js/**/*.js`)
    .pipe(sourcemaps.init())
    .pipe(plumber())
    //.pipe(babel(options))
    .pipe(terser())
    .pipe(sourcemaps.write(`.`))
    .pipe(dest(`public/js`))
    .pipe(bs.stream()); // Recarga el navegador automáticamente cuando los archivos JS cambian

  done();
}

/**
 * Toma las imágenes en la carpeta `src/assets/img`, los optimiza, y las guarda en la carpeta `public/assets/img`
 * @param done - Indica a gulp cuando una tarea terminó.
 */
export function img(done) {
  const options = {
    optimizationLevel: 3,
  };

  src(`src/assets/img/**/*.{png,jpg,svg}`)
    .pipe(plumber())
    .pipe(cache(imgMin(options)))
    .pipe(dest(`public/assets/img`));

  done();
}

/**
 * Toma las imágenes en la carpeta `src/assets/img`, los convierte al formato Webp, y las guarda en la carpeta `public/assets/img`
 * @param done - Indica a gulp cuando una tarea terminó.
 */
export function vWebp(done) {
  const options = {
    quality: 50,
  };

  src(`src/assets/img/**/*.{png,jpg}`)
    .pipe(plumber())
    .pipe(webp(options))
    .pipe(dest(`public/assets/img`));

  done();
}

/**
 * Toma las imágenes en la carpeta `src/assets/img`, los convierte al formato AVIF, y las guarda en la carpeta `public/assets/img`
 * @param done - Indica a gulp cuando una tarea terminó.
 */
export function vAvif(done) {
  const options = {
    quality: 50,
  };

  src(`src/assets/img/**/*.{png,jpg}`)
    .pipe(plumber())
    .pipe(avif(options))
    .pipe(dest(`public/assets/img`));

  done();
}

/**
 * Observa los cambios en el HTML, CSS y las imágenes y corre las tareas respectivas para ejecutar los cambios detectados.
 * @param done - Es una función callback que indica a gulp cuando la tarea terminó.
 */
export function dev(done) {
  watch(`src/views/**/*.html`, series(html, cleanCSS));
  watch(`src/styles/**/*.css`, series(css, cleanCSS));
  watch(`src/js/**/*.js`, javaScript);
  watch(`src/assets/img/**/*.{png,jpg,svg}`, parallel(img, vWebp, vAvif));

  done();
}

/* Exportaciones finales */

// La tarea `build` corre las tareas de HTML, CSS, JS, y optimización de imágenes en paralelo, y luego corre la tarea de limpieza de CSS después de que todas las tareas anteriores hayan terminado.
export const build = series(
  parallel(html, css, javaScript, img, vWebp, vAvif),
  cleanCSS,
);

// La tarea `default` corre la tarea de construcción y luego inicia el servidor de desarrollo y el observador de archivos en paralelo.
export default series(build, parallel(browserServer, dev));
