<div align="center">
<img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML" />&nbsp;&nbsp;
<img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS" />&nbsp;&nbsp;
<img src="https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E"/>&nbsp;&nbsp;
<img src="https://img.shields.io/badge/Gulp-CF4647?style=for-the-badge&logo=gulp&logoColor=white" alt="Gulp" />&nbsp;&nbsp;

</div>


## Uso 
### El proyecto debe contener: 
1. Un archivo gulpfile.js donde se colocarán todas las configuraciones del proyecto.
### 1.- Instalaciones únicas
Sólo se instala una vez de manera global 
```bash
npm install --global gulp-cli
```
### 2.- Instalaciones de cada proyecto
Estos comandos deben ejecutarse en cada proyecto que vaya a ser utilizado Gulp. 
#### Si se tiene el Package.json solo ejecutar el: 
```bash
npm i // npm install 
```
#### No se tiene el package.json 
```bash
npm init
npm install --save-dev gulp
```
#### HTML
```bash
npm install --save gulp-htmlmin ##Minifica y limpia nuestro HTML
```
#### CSS

```bash
npm i --save-dev gulp-postcss cssnano autoprefixer
npm i --save-dev gulp-purgecss ##Limpiar el CSS que no se usa.
```

### JavaScript 
```bash
npm i --save-dev gulp-terser ##Minifica el codigo JS
npm i --save-dev gulp-babel @babel/core @babel/preset-env ##Transpilar JS (OPCIONAL)
```

#### Plugins de imágenes

```bash
npm i --save-dev gulp-imagemin@7.1.0 ##Aligerar imágenes.
npm i --save-dev gulp-cache ##Ayuda a procesar las imágenes en caché. 
npm i --save-dev gulp-webp ##Convierte imágenes a webp.
npm i --save-dev gulp-avif ##Convierte imágenes a Avif.
```

#### Plugins extra

```bash
npm i --save-dev gulp-plumber ##Evita que se detenga la ejecución al presentar errores.
npm i --save-dev gulp-concat ##Une todos nuestros archivos en uno solo.
npm i --save-dev gulp-cache-bust ##Limpia la caché
npm i --save-dev gulp-sourcemaps 
npm i --save-dev browser-sync ## Crea un servidor de desarrollo
```
