const gulp = require('gulp'),
    terser = require('gulp-terser'),
    cleancss = require('gulp-clean-css'),
    htmlmin = require('gulp-htmlmin');

gulp.task('move', () => gulp.src('src/**')
    .pipe(gulp.dest('build')));

gulp.task('m-js', () => gulp.src('src/**/*.js')
    .pipe(terser({
            ecma:6,
            mangle: false
    }))
    .pipe(gulp.dest('build')));

gulp.task('m-css', () => gulp.src('src/**/*.css')
    .pipe(cleancss())
    .pipe(gulp.dest('build')));

gulp.task('m-html', () => gulp.src('src/**/*.html')
    .pipe(htmlmin({
        removeComments: true,
        collapseWhitespace: true,
        collapseInlineTagWhitespace: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
    }))
    .pipe(gulp.dest('build')));

gulp.task('default', gulp.series('move', gulp.parallel('m-js', 'm-css', 'm-html')));