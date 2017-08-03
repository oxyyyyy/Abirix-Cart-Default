var gulp = require('gulp'),
	rename = require('gulp-rename'),
	data = require('gulp-data'),
	autoprefixer = require('gulp-autoprefixer'),
	minifyCSS = require('gulp-minify-css'),
	minify = require('gulp-minify'),
	htmlhint = require("gulp-htmlhint"),
	clean = require('gulp-clean'),
	concat = require('gulp-concat'),
	gutil = require('gulp-util'),
	sass = require('gulp-sass'),
	cache = require('gulp-cache'),
	beautify = require('gulp-html-beautify'),
	sassGlob = require('gulp-sass-glob'),
	wait = require('gulp-wait'),
	cssbeautify = require('gulp-cssbeautify'),
	fs = require("fs"),
	spritesmith = require('gulp.spritesmith'),
	cssFormat = require('gulp-css-format'),
	//ftp = require('gulp-ftp'),
	jade = require('gulp-jade'),
	imageop = require('gulp-image-optimization'),
	connect = require('gulp-connect'),
	current_lang="en";

//Connect server http://localhost:8080
gulp.task('connect', function() {
	connect.server({
		name: 'App Lang '+current_lang,
		root:'app',
		livereload:true
	});
});

//Copy & Clean files
gulp.task('clean', function () {
	return gulp.src(['./app/dist/img/*'], {read: false})
		.pipe(clean());
});
gulp.task('copyImg', ['clean'], function (e) {
	gulp.src(['./app/src/img/lang_'+current_lang+'/*/**', './app/src/img/lang_'+current_lang+'/*'])
	.pipe(gulp.dest('./app/dist/img/lang_'+current_lang+'/'));
});
gulp.task('copyImgCommon', ['clean'], function (paths, outputFilename) {
	gulp.src(['./app/src/img/common/*/**', './app/src/img/common/*'])
	.pipe(gulp.dest('./app/dist/img/common/'))
});
gulp.task('copyFonts', ['clean'], function () {
	gulp.src(['./app/src/css/fonts/*', './app/src/css/fonts/*/**'])
	.pipe(gulp.dest('./app/dist/css/fonts/'));
});
gulp.task('copyLang', ['clean'], function () {
	gulp.src(['./app/src/text/*/**', './app/src/text/*'])
	.pipe(gulp.dest('./app/dist/text/'));
});

//Clear Cash
gulp.task('clear', function (done) {
	return cache.clearAll(done);
});

//Creat spirite
gulp.task('sprite', function () {
	var spriteData = gulp.src('./app/src/img/lang_'+current_lang+'/icons/*.png').pipe(spritesmith({
		imgName: '../app/dist/img/lang_'+current_lang+'/'+'sprite.png',
		cssName: '../app/src/css/sprite.sass',
		imgPath: '../img/lang_'+current_lang+'/sprite.png'
	}));
	var imgStream = spriteData.img
	.pipe(gulp.dest('./app/'));
	var cssStream = spriteData.css
	.pipe(gulp.dest('./app'));
});

//Generate HTML
gulp.task('jade', function() {
	return gulp.src('./app/src/tpl/*.jade')
	.pipe(data(function(file) {
		return JSON.parse(
			fs.readFileSync('./app/src/text/'+current_lang+'.json')
		);
	}))
	.pipe(jade({
		pretty: true
	})) 
	.pipe(beautify({
		ndentSize: 4,
		indent_char: " ",
		ndent_with_tabs: true,
	}))
	.pipe(gulp.dest('./app/dist/'))
	.pipe(connect.reload());
});

//Javascript Copy and Minify
gulp.task('js', function () {
	return gulp.src(['./app/src/js/*'])
	//.pipe(concat('lib.js'))
	//.pipe(minify())
	.pipe(gulp.dest('./app/dist/js/'))
	.pipe(connect.reload())
});

//Generate CSS
gulp.task('sass', function () {
	return gulp.src('./app/src/css/style.sass')
	.pipe(wait(300))
	.pipe(sassGlob())
	.pipe(sass().on('error', function(err) {
		const message = err.message || '';
		const errName = err.name || '';
		const codeFrame = err.codeFrame || '';
		gutil.log(gutil.colors.red.bold('[JS babel error]')+' '+ gutil.colors.bgRed(errName));
		gutil.log(gutil.colors.bold('message:') +' '+ message);
		gutil.log(gutil.colors.bold('codeframe:') + '\n' + codeFrame);
		this.emit('end');
	}))
	//.pipe(concat('app.css'))
	//.pipe(minifyCSS())
	.pipe(rename({basename: "app"}))
	.pipe(gulp.dest('./app/dist/css'))
	.pipe(connect.reload())
});

//Watch task
gulp.task('watch', function() {
	gulp.watch(['app/src/css/*.sass', 'app/src/css/_*.sass'], ['clear','sass'])
	gulp.watch(['app/src/js/*.js'], ['js'])
	gulp.watch('app/src/tpl/*.jade', ['jade'])
	gulp.watch('app/src/img/*/**', ['sprite', 'copyImg', 'copyImgCommon'])
	gulp.watch('app/src/css/fonts/*', ['copyFonts'])
	gulp.watch('app/src/tpl/include/*.jade', ['jade'])
});

//Default task run
gulp.task('default', [ 'clear', 'sprite', 'copyLang', 'copyImg', 'copyImgCommon', 'copyFonts', 'jade', 'sass', 'js', 'watch', 'connect']);