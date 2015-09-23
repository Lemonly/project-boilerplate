var gulp = require('gulp'),
    connect = require('gulp-connect'),
    open = require('gulp-open'),
    babel = require('gulp-babel'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    clean = require('gulp-clean'),
    copy = require('gulp-copy'),
    gulpIgnore = require('gulp-ignore'),
    minifyCss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    htmlreplace = require('gulp-html-replace'),
    zip = require('gulp-zip');

gulp.task('connect', function() {
    connect.server({
        root: './dev',
        livereload: true
    });
});

gulp.task('html', function() {
    gulp.src('./dev/*.html')
        .pipe(connect.reload());
});

gulp.task('babel', function() {
    gulp.src('./dev/js/**/*.es6')
        .pipe(babel())
        .pipe(gulp.dest('./dev/js'))
        .pipe(connect.reload());
});

gulp.task('sass', function() {
    gulp.src('./dev/scss/styles.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dev/css'));
});

gulp.task('css', function() {
    gulp.src('./dev/css/*.css')
        .pipe(connect.reload());
});

gulp.task('open', function() {
    gulp.src(__filename)
        .pipe(open({uri: 'http://0.0.0.0:8080'}));
});

gulp.task('watch', function() {
    gulp.watch(['./dev/**/*.html'], ['html']);
    gulp.watch(['./dev/js/**/*.es6'], ['babel']);
    gulp.watch(['./dev/scss/**/*.scss'], ['sass']);
    gulp.watch(['./dev/css/**/*.css'], ['css']);
});

// Delete the build directory if it exists
gulp.task('clean', function() {
    return gulp.src('./build')
               .pipe(clean());
});

gulp.task('clean-unminified', ['build-copy', 'minify-css', 'uglify'], function() {
    return gulp.src([
                    './build/css/styles.css',
                    './build/js/site/app.js'
               ])
               .pipe(clean());
});

gulp.task('build-copy', ['clean'], function() {
    return gulp.src([
                    './dev/**/*',
                    '!./dev/{scss,scss/**}',
                    '!./**/*.map',
                    '!./**/*.es6'
                ])
               .pipe(gulp.dest('build'));
});

gulp.task('minify-css', ['build-copy'], function() {
    return gulp.src('./build/css/styles.css')
               .pipe(minifyCss())
               .pipe(rename({suffix: '.min'}))
               .pipe(gulp.dest('build/css'));
});

gulp.task('uglify', ['build-copy'], function() {
    return gulp.src('./build/js/site/**/*.js')
               .pipe(uglify())
               .pipe(rename({suffix: '.min'}))
               .pipe(gulp.dest('build/js/site'));
});

gulp.task('html-replace', ['build-copy'], function() {
    gulp.src('./build/index.html')
        .pipe(htmlreplace({
            'css': 'css/styles.min.css',
            'js': 'js/site/app.min.js'
        }))
        .pipe(gulp.dest('build/'))
});

gulp.task('zip', ['html-replace', 'clean-unminified'], function() {
    return gulp.src('./{build,build/**}')
               .pipe(zip('build.' + dateHash() + '.zip'))
               .pipe(gulp.dest('./'));
})

gulp.task('server', ['sass', 'babel', 'connect', 'open', 'watch']);

gulp.task('build', ['sass', 'babel', 'clean', 'build-copy', 'minify-css', 'uglify', 'html-replace', 'clean-unminified', 'zip']);

//for zip creation
var dateHash = function() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();

    if(dd<10) {
        dd='0'+dd
    }

    if(mm<10) {
        mm='0'+mm
    }

    var date = yyyy + '-' + mm + '-' + dd + '.' + today.getTime();
    return date;
}

