/*global -$ */
'use strict';
// generated on 2015-03-28 using generator-gulp-webapp 0.3.0
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var reload = browserSync.reload;

gulp.task('styles', function() {
  return gulp.src('app/styles/gauge.scss')
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      outputStyle: 'nested', // libsass doesn't support expanded yet
      precision: 10,
      includePaths: ['.'],
      onError: console.error.bind(console, 'Sass error:')
    }))
    .pipe($.postcss([
      require('autoprefixer-core')({
        browsers: ['last 1 version']
      })
    ]))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('.tmp/styles'))
    .pipe(reload({
      stream: true
    }));
});

gulp.task('jshint', function() {
  return gulp.src('app/scripts/**/*.js')
    .pipe(reload({
      stream: true,
      once: true
    }))
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});

gulp.task('html', ['styles'], function() {
  var assets = $.useref.assets({
    searchPath: ['.tmp', 'app', '.']
  });

  return gulp.src('app/*.html')
    .pipe(assets)
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.csso()))
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.if('*.html', $.minifyHtml({
      conditionals: true,
      loose: true
    })))
    .pipe(gulp.dest('dist'));
});

gulp.task('extras', function() {
  return gulp.src([
    'app/*.*',
    '!app/*.html'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
});

gulp.task('clean', require('del').bind(null, ['.tmp', 'dist']));

gulp.task('serve', ['styles'], function() {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['.tmp', 'app'],
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });

  // watch for changes
  gulp.watch([
    'app/*.html',
    'app/scripts/**/*.js',
  ]).on('change', reload);

  gulp.watch('app/styles/**/*.scss', ['styles']);
  gulp.watch('bower.json', ['wiredep']);
});

// inject bower components
gulp.task('wiredep', function() {
  var wiredep = require('wiredep').stream;

  gulp.src('app/styles/*.scss')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)+/
    }))
    .pipe(gulp.dest('app/styles'));

  gulp.src('app/*.html')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('app'));
});

gulp.task('build', ['html', 'extras'], function() {
  return gulp.src('dist/**/*').pipe($.size({
    title: 'build',
    gzip: true
  }));
});

gulp.task('default', ['clean'], function() {
  gulp.start('build');
});