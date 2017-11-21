var gulp = require('gulp'),
		browserify = require('browserify'),
		babelify = require('babelify'),
		source = require('vinyl-source-stream'),
		sass = require('gulp-sass'),
		bulkSass = require('gulp-sass-glob'),
		pug = require('gulp-pug'),
		browserSync = require('browser-sync'),
		image = require('gulp-image'),
		autoprefixer = require('gulp-autoprefixer');

gulp.task('styles', function() {
	return gulp.src('app/styles/app.sass')
		.pipe(bulkSass())
		.pipe(sass({
			includePaths: ['app/styles']
		}))
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(gulp.dest('dist/assets/styles'))
		.pipe(browserSync.reload({stream: true}))
});

gulp.task('templates', function() {
	return gulp.src('app/pages/index.pug')
		.pipe(pug())
		.pipe(gulp.dest('dist'))
		.pipe(browserSync.reload({stream: true}))
});

gulp.task('scripts', function() {
	return browserify('app/scripts/app.js', {debug: true})
    .transform(babelify, {presets: ["es2015"]})
    .bundle()
    .pipe(source('scripts.js'))
    .pipe(gulp.dest('dist/assets/scripts'))
		.pipe(browserSync.reload({stream: true}))
});

gulp.task('fonts', function () {
    gulp.src('app/resources/fonts/**/*')
    	.pipe(gulp.dest('dist/assets/fonts'))
			.pipe(browserSync.reload({stream: true}))
});

gulp.task('images', function() {
	return gulp.src('app/resources/images/*')
		.pipe(image())
		.pipe(gulp.dest('dist/assets/images'))
		.pipe(browserSync.reload({stream: true}))
});

gulp.task('copy', function() {
	return gulp.src('app/resources/data/*')
		.pipe(gulp.dest('dist/assets/data'))
		.pipe(browserSync.reload({stream: true}))
});

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: ['./', 'dist']
		},
		notify : false
	});
});

gulp.task('default', ['browser-sync', 'styles', 'templates', 'scripts', 'fonts', 'copy', 'images'], function() {
	gulp.watch(['app/blocks/**/*', 'app/styles/*'], ['styles']);
	gulp.watch(['app/blocks/**/*', 'app/pages/index.pug'], ['templates']);
	gulp.watch(['app/blocks/**/*', 'app/scripts/app.js'], ['scripts']);
	gulp.watch(['app/resources/data/*'], ['copy']);
	gulp.watch(['app/resources/images/*'], ['images']);
});
