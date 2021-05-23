const gulp = require("gulp"),
    concat = require("gulp-concat"),
    minify = require("gulp-minify"),
    replace = require("gulp-replace"),
    cleanCss = require("gulp-clean-css"),
    cleanCssComments = require("gulp-strip-css-comments"),
    sass = require("gulp-sass");

// const sourcemaps = require('gulp-sourcemaps');
const source = require('vinyl-source-stream');
// const buffer = require('vinyl-buffer');
const browserify = require('browserify');
const babel = require('babelify');

function pack_js() {
    return gulp.src(["js/vendor/**/*.js", "dist/js/app.js"])
        .pipe(concat("main.js"))
        .pipe(minify({
            ext: {
                min: ".js"
            },
            noSource: true
        }))
        .pipe(gulp.dest("dist/"));
}

function bundleModuleCode(){
    // set up the browserify instance on a task basis
    var b = browserify({entries: [
            "node_modules/@babel/polyfill/dist/polyfill.min.js",
            "js/src/init.js"
        ]}, { debug: true })
        .transform(babel, { presets: ["@babel/preset-env"]});

    return b.bundle()
        .on('error', function(err){
            // print the error (can replace with gulp-util)
            console.log(err.message);
            // end this stream
            this.emit('end');
        })
        .pipe(source("app.js"))
        // .pipe(buffer())
        // .pipe(sourcemaps.init({loadMaps: true}))
        //     // Add transformation tasks to the pipeline here.
        //     //.pipe(uglify())
        // .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist/js/'));
}

function pack_css(){
    return gulp.src(["style/vendor/*.css", "style/src/*.css"])
        .pipe(concat("stylesheet.css"))
        .pipe(cleanCssComments({preserve: false}))
        .pipe(cleanCss())
        .pipe(replace("../webfonts/", "../style/webfonts/"))
        .pipe(minify())
        .pipe(gulp.dest("dist/"));
}

function preprocess_sass(){
    return gulp.src(["style/scss/src/main.scss"])
    .pipe(sass())
    .pipe(concat("style.css"))
    .pipe(gulp.dest("style/src/"));
}

gulp.task('sass:watch', function () {
  gulp.watch('style/scss/**/*.scss', preprocess_sass);
});

gulp.task("js:watch", function () {
   gulp.watch("js/src/**/*.js",  gulp.series(bundleModuleCode, pack_js));
});

gulp.task("dev", function () {
    gulp.watch('style/scss/**/*.scss', preprocess_sass);
    gulp.watch("js/src/**/*.js",  gulp.series(bundleModuleCode, pack_js));
});

gulp.task("roll", bundleModuleCode);

exports.default = gulp.series(
    gulp.parallel(preprocess_sass, bundleModuleCode), // Make sure we do sass -> css FIRST so we can bundle it in pack_css
    gulp.parallel(pack_js, pack_css)
);
