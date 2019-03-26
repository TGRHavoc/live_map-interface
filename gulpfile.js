var gulp = require('gulp');
var concat = require('gulp-concat');
var minify = require('gulp-minify');
var replace = require("gulp-replace");
var cleanCss = require('gulp-clean-css');
var cleanCssComments = require("gulp-strip-css-comments");

function pack_js() {
    return gulp.src(['js/vendor/*.js', "js/src/*.1.js"])
        .pipe(concat('first-bundle.js'))
        .pipe(minify({
            ext: {
                min: '.js'
            },
            noSource: true
        }))
        .pipe(gulp.dest('dist/'));
}

function pack_js_2() {
    return gulp.src(['js/src/*.2.js'])
        .pipe(concat('last-bundle.js'))
        .pipe(minify({
            ext: {
                min: '.js'
            },
            noSource: true
        }))
        .pipe(gulp.dest('dist/'));
}

function pack_css(){
    return gulp.src(['style/vendor/*.css', 'style/src/*.css'])
        .pipe(concat('stylesheet.css'))
        .pipe(cleanCssComments({preserve: false}))
        .pipe(cleanCss())
        .pipe(replace("../webfonts/", "../style/webfonts/"))
        .pipe(minify())
        .pipe(gulp.dest('dist/'));
}

exports.default = gulp.parallel(pack_js, pack_js_2, pack_css);
