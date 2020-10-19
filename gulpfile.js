const gulp = require('gulp'),
      del = require('del'),
      sass = require('gulp-sass'),
      plumber = require('gulp-plumber'),
      postcss = require('gulp-postcss'),
      autoprefixer = require('autoprefixer'),
      browserSync = require('browser-sync').create(),
      csso = require("gulp-csso"),
      htmlmin = require('gulp-htmlmin'),
      uglify = require('gulp-uglify'),
      rename = require('gulp-rename'),
      imagemin = require('gulp-imagemin'),
      imageminJpegtran = require('imagemin-jpegtran'),
      imageminPngquant = require('imagemin-pngquant'),
      webp = require('gulp-webp'),
      svgstore = require('gulp-svgstore'),
      posthtml = require('gulp-posthtml'),
      include = require('posthtml-include');


// Local server (gulp watch)

gulp.task('style', function () {
    return gulp.src('source/sass/style.scss')
        .pipe(plumber())
        .pipe(sass())
        .pipe(gulp.dest('source/css'));
});

gulp.task('watch', function () {
    browserSync.init ({
        server: 'build/'
    });
    gulp.watch('source/sass/**/*.scss', gulp.series('minify-css'));
    gulp.watch('source/*.html', gulp.series('html'));
});


// Minify CSS/HTML/JS

gulp.task('minify-css', function () {
    return gulp.src('source/sass/style.scss')
        .pipe(plumber())
        .pipe(sass())
        .pipe(browserSync.stream())
        .pipe(postcss([
            autoprefixer()
        ]))
        .pipe(gulp.dest('build/css'))
        .pipe(csso())
        .pipe(rename('style.min.css'))
        .pipe(gulp.dest('build/css'));
});

gulp.task('minify', function () {
    return gulp.src('source/*.html')
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(posthtml([
            include()
        ]))
        .pipe(gulp.dest('build'));
});

gulp.task('minify-html', function () {
    return gulp.src('source/index.html')
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(posthtml([
            include()
        ]))
        .pipe(rename('index.min.html'))
        .pipe(gulp.dest('source'));
});

gulp.task('minify-js', function () {
    return gulp.src('./js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('./build/js'));
});


// Minify images/convert WebPack/build sprite

gulp.task('images', function () {
    return gulp.src('./source/img/**/*.{png,jpg,svg}')
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
	        imagemin.mozjpeg({quality: 75, progressive: true}),
	        imagemin.optipng({optimizationLevel: 5})
	    ]))
    .pipe(gulp.dest('source/img'));
});

gulp.task('webp', function () {
    return gulp.src('source/img/**/*.{png,jpg}')
        .pipe(webp())
        .pipe(gulp.dest('source/img'));
});

gulp.task('sprite', function () {
    return gulp.src('source/img/icons/icon-*.svg')
        .pipe(svgstore({
            inlineSvg: true
        }))
        .pipe(rename('sprite.svg'))
        .pipe(gulp.dest('build/img'));
});

gulp.task('html', function () {
    return gulp.src('source/*.html')
        .pipe(posthtml([
            include()
        ]))
        .pipe(gulp.dest('build'));
});


// Build

gulp.task('copy', function () {
    return gulp.src([
        'source/fonts/**/*.{woff,woff2}',
        'source/img/**/*',
        'source/js/**'
    ], {
        base: 'source'
    })
        .pipe(gulp.dest('build'));
});

gulp.task('clean', function () {
    return del('./build');
});

gulp.task('build', gulp.series(
    'clean',
    'copy',
    'sprite',
    'html',
    'style',
    'minify',
    'minify-html',
    'minify-css',
    'minify-js'
));