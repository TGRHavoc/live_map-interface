const gulp = require("gulp"),
    concat = require("gulp-concat"),
    minify = require("gulp-minify"),
    replace = require("gulp-replace"),
    cleanCss = require("gulp-clean-css"),
    cleanCssComments = require("gulp-strip-css-comments"),
    sass = require("gulp-sass");

function pack_js() {
    return gulp.src(["js/vendor/**/*.js", "js/src/first_bundle/**/*.js"])
        .pipe(concat("first-bundle.js"))
        .pipe(minify({
            ext: {
                min: ".js"
            },
            noSource: true
        }))
        .pipe(gulp.dest("dist/"));
}

function pack_js_2() {
    return gulp.src(["js/src/last_bundle/**/*.js"])
        .pipe(concat("last-bundle.js"))
        .pipe(minify({
            ext: {
                min: ".js"
            },
            noSource: true
        }))
        .pipe(gulp.dest("dist/"));
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

exports.default = gulp.series(
    preprocess_sass, // Make sure we do sass -> css FIRST so we can bundle it in pack_css
    gulp.parallel(pack_js, pack_js_2, pack_css)
);
