'use strict'

var gulp = require('gulp')
var bowerFromFile = require('gulp-bower-files-from-html')
var clean = require('gulp-clean')
var cleanCSS = require('gulp-clean-css')
var concat = require('gulp-concat')
var htmlReplace = require('gulp-html-replace')
var minify = require('gulp-minify')
var templateCache = require('gulp-angular-templatecache')

/* IMPORTANT!!!! Do not include trailing back slash because of logic below. */
var bowerFolder = './app/client/bower_components'
var distFolder = './app/dist'
var tempBowerFolder = './app/client/tmp_bower_cache'
var tempFolder = './app/client/tmp'

gulp.task('removeExistingDist', function () {
  return gulp.src('./app/dist', {read: false})
  .pipe(clean())
})

gulp.task('fetchBowerFiles', function () {
  return gulp.src('./app/client/index.html')
  .pipe(bowerFromFile())
  .pipe(gulp.dest(tempBowerFolder))
})

gulp.task('concatBowerFiles', ['fetchBowerFiles'], function () {
  return gulp.src([(tempBowerFolder + '/**/*.js'), ('!' + tempBowerFolder + '/**/*.min.js')])
  .pipe(concat('vendors.js'))
  .pipe(gulp.dest(tempFolder))
})

gulp.task('minifyVendorJS', ['concatBowerFiles'], function () {
  return gulp.src(tempFolder + '/vendors.js')
  .pipe(minify({noSource: true}))
  .pipe(gulp.dest(distFolder))
})

gulp.task('minifyCSS', ['removeExistingDist'], function () {
  return gulp.src('./app/client/app.css')
  .pipe(cleanCSS({keepBreaks: false}))
  .pipe(gulp.dest(distFolder))
})

gulp.task('cacheTemplates', function () {
  return gulp.src(['./app/client/**/*.html', ('!' + bowerFolder + '/**/*.html'), ('!' + tempBowerFolder + '/**/*.html'), ('!' + tempFolder + '/**/*.html')])
  .pipe(templateCache({module: 'myApp'}))
  .pipe(gulp.dest(tempFolder))
})

gulp.task('concatJS', ['cacheTemplates'], function () {
  return gulp.src([
                    './app/client/**/*.js',
                    ('!' + bowerFolder + '/**/*.js'),
                    ('!' + tempBowerFolder + '/**/*.js'),
                    ('!' + tempFolder + '/**/*.js')
                ])
  .pipe(concat('app.js'))
  .pipe(gulp.dest(tempFolder))
})

gulp.task('minifyJS', ['removeExistingDist', 'concatJS'], function () {
  return gulp.src(tempFolder + '/app.js')
 // .pipe(minify({noSource: true}))
  .pipe(gulp.dest(distFolder))
})

gulp.task('updateHTMLPage', ['minifyVendorJS', 'minifyJS'], function () {
  return gulp.src('./app/client/index.html')
  .pipe(htmlReplace({'css': 'app.css', 'js': 'app.js', 'vendorjs': 'vendors-min.js'}))
  .pipe(gulp.dest(distFolder))
})

gulp.task('copyImageFolder', ['removeExistingDist'], function () {
  return gulp.src('./app/client/img/*')
  .pipe(gulp.dest(distFolder + '/img'))
})

gulp.task('removeTempFolders', ['minifyCSS', 'copyImageFolder', 'updateHTMLPage'], function () {
  return gulp.src([tempFolder, tempBowerFolder], {read: false})
  .pipe(clean())
})

gulp.task('default', ['removeTempFolders'])
