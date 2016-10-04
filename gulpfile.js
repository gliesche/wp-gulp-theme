var gulp = require('gulp');

var $ = require('gulp-load-plugins')(),
  themeName = "wp-theme"
  themePath = "",
  bowerPath = themePath + "src/bower_components/";

var DEV_MODE = (process.env.NODE_ENV != 'production');

// Styles
// 1. Run sass
// 2. Autoprefix for last 2 browser versions, see: https://support.google.com/a/answer/33864
//    and support browsers with a market share bigger that 1%
//    and include IE 8
// 3. Copy to destination folder
gulp.task('styles', function(){
  return gulp.src(themePath + 'src/styles/styles.scss')
    .pipe($.sass())
    .pipe($.replace('../src/images/', '../images/'))        // since this can't be setup with compass yet, replace src with dist
    .pipe($.autoprefixer("last 2 versions", "> 1%", "ie 9"))
    .pipe($.importCss())
    .pipe($.csscomb({noAdvanced: true}))
    .pipe($.util.env.env === 'production' ? $.cssmin() : $.util.noop())
    .pipe($.rename({suffix: '.min'}))
    .pipe(gulp.dest(themePath + 'assets/styles'))
    .pipe($.size());
});


// scripts task
gulp.task('scripts', ['vendorscripts', 'plugins'], function () {
  return gulp.src([themePath + 'src/scripts/**/*.js'])
    .pipe($.jshint('.jshintrc'))
    .pipe($.jshint.reporter('default'))
    .pipe($.util.env.env === 'production' ? $.uglify(): $.util.noop())
    .pipe($.concat('build.js'))
    .pipe($.rename({suffix: '.min'}))
    .pipe(gulp.dest(themePath + 'assets/scripts'))
    .pipe($.size());
});

gulp.task('vendorscripts', function() {
  gulp.src(bowerPath + 'modernizr/modernizr.js')
    .pipe($.uglify())
    .pipe($.rename({suffix: ".min"}))
    .pipe(gulp.dest(themePath + 'assets/scripts/vendor'))
    .pipe($.size());
});

gulp.task('plugins', function() {
  return gulp.src([themePath + 'src/scripts/plugins.js'])
    .pipe($.uglify())
    .pipe($.rename({
        basename: "plugins",
        suffix: ".min",
        extname: ".js"
      })
    )
    .pipe(gulp.dest(themePath + 'assets/scripts'))
    .pipe($.size());
});


// images task
gulp.task('images', function() {
  return gulp.src(themePath + 'src/images/**/*')
      .pipe($.imagemin({
          optimizationLevel: 3,
          progressive: true,
          interlaced: true,
          svgoPlugins : [
            { removeViewBox: false }
          ]
      }))
      .pipe(gulp.dest(themePath + 'assets/images'))
      .pipe($.size());
});

// fonts task
gulp.task('fonts', function () {
  return gulp.src(themePath + 'src/fonts/**/*')
    .pipe(gulp.dest(themePath + 'assets/fonts'))
    .pipe($.size());
});

// svg task
gulp.task('svg', function() {
  return gulp.src(themePath + 'src/svg/**/*')
    .pipe($.imagemin({
        svgoPlugins : [
          { removeViewBox: false }
        ]
    }))
    .pipe(gulp.dest(themePath + 'assets/svg'))
    .pipe($.size());
});

// convert svg to png
gulp.task('svg2png', function(){

  return gulp.src(themePath + 'src/svg/*.svg')
    .pipe($.raster())
    .pipe($.rename(function (path) {
        path.dirname = "/";
        path.extname = ".png"
      }))
    .pipe(gulp.dest(themePath + 'src/images'))
    .pipe($.size());
});


// Connect
gulp.task('connect', $.connect.server({
  livereload: true
}));

// Watch
gulp.task('watch', ['connect'], function () {
  // Watch for changes and trigger reload
  gulp.watch([
    themePath + 'src/styles/**/*.scss',
    themePath + 'assets/styles/styles.min.css',
    themePath + 'src/scripts/**/*.js',
    themePath + 'src/images/**/*',
    themePath + 'src/svg/**/*',
    themePath + '**/*.php'
  ], function(event) {
    return gulp.src(event.path)
      .pipe($.connect.reload());
  });

  // Watch .scss files
  gulp.watch(themePath + 'src/styles/**/*.scss', ['styles']);

  // Watch .js files
  gulp.watch(themePath + 'src/scripts/**/*.js', ['scripts']);

  // Watch image files
  gulp.watch(themePath + 'src/images/**/*', ['images']);

  // Watch font files
  gulp.watch(themePath + 'src/fonts/**/*', ['fonts']);

  // Watch svg files
  gulp.watch(themePath + 'src/svg/**/*', ['svg', 'svg2png']);

});

gulp.task('build', ['styles', 'scripts', 'images', 'fonts'], function() {
  return gulp.src(themePath + 'assets/**/*').pipe($.size({title: 'build'}));
});

gulp.task('default', function() {
  gulp.start('build');
});
