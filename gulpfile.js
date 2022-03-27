const { src, dest, watch, series, parallel } = require('gulp');

// CSS y SASS
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const cssnano = require('cssnano');

// Imagenes
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');

//compilar Sass
//pasos: 1 identificar archivo, 2 compilar, 3 guardarel css
function css( done ) {
    //donde se encuentra la carpeta de archivos sass
    src('src/scss/app.scss')
        //Para mapear donde estan las cosas una vez compiladas, Se pone aqui y antes de guardarlo
        .pipe( sourcemaps.init() )
        //compila
        .pipe( sass() )
        //autoprefixfer para modificar el css dependiendo del navegador que ponen en el json en el apartado browers
        //sccnano para simplificar mas aun el css en el build y que pese menos(unificar)
        .pipe( postcss([ autoprefixer(), cssnano() ]) )
        //Mapeo
        .pipe( sourcemaps.write('.'))
        //guardar
        .pipe( dest('build/css') )

    done();
}

//para pasar las imagenes a build
function imagenes() {
    //carga todos los archivos
    return src('src/img/**/*')
        //para optimizar las imagenes y que ocupen menos
        .pipe( imagemin({ optimizationLevel: 3 }) )
        //donde los guardas
        .pipe( dest('build/img') )
}

//convertir las imagenes que se pueda en webp
function versionWebp() {
    //Para optimizarlas bajando la calidad
    const opciones = {
        quality: 50
    }
    return src('src/img/**/*.{png,jpg}')
        .pipe( webp( opciones ) )
        .pipe( dest('build/img') )
}

//convertir las imagenes que se pueda en avif
function versionAvif() {
    const opciones = {
        quality: 50
    }
    return src('src/img/**/*.{png,jpg}')
        .pipe( avif( opciones ) )
        .pipe( dest('build/img'))
}

//para ver las modificaciones en desarollo para no volver a compilar
//coge dos valores, le dices el archivo que revisa y dos que hace
function dev() {
    watch( 'src/scss/**/*.scss', css );
    watch( 'src/img/**/*', imagenes );
}


exports.css = css;
exports.dev = dev;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
//Tareas por defecto, las ejecutas sin llamarlas
exports.default = series( imagenes, versionWebp, versionAvif, css, dev  );

// series - Se inicia una tarea, y hasta que finaliza, inicia la siguiente
// parallel - Todas inician al mismo tiempo