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
    return gulp.src(["style/scss/src/**/*.scss"])
    .pipe(sass())
    .pipe(concat("style.css"))
    .pipe(gulp.dest("style/src/"));
}
function preprocess_bootstrap(){
    return gulp.src(["style/scss/bootstrap/**/*.scss"])
    .pipe(sass())
    .pipe(concat("bootstrap.css"))
    .pipe(gulp.dest("style/vendor/"));
}

gulp.task('sass:watch', function () {
  gulp.watch('style/scss/src/**/*.scss', preprocess_sass);
});

exports.default = gulp.series(
    gulp.parallel(
        preprocess_sass, // Make sure we compile any SASS first.
        preprocess_bootstrap
    ),
    gulp.parallel(pack_js, pack_js_2, pack_css)
);
