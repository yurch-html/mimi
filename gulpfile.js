var gulp  		= require('gulp'),
	sass  		= require('gulp-sass'),
	uglify 		= require('gulp-uglifyjs'),
	concat 		= require('gulp-concat'),
	cssnano 	= require('gulp-cssnano'),
	rename  	= require('gulp-rename'),
	imagemin	= require('gulp-imagemin'),
	pngquant	= require('imagemin-pngquant'),
	rigger 		= require('gulp-rigger'),
	prefix		= require('gulp-autoprefixer'),
	del         = require('del'),
	cache 		= require('gulp-cache');


gulp.task('del', function() {
	return del.sync('dist'); 
});


gulp.task('html', function(){
	gulp.src('app/html/*.html')
		.pipe(rigger())
		.pipe(gulp.dest('app'))
});

gulp.task('sass', function(){
	return gulp.src('app/sass/**/*.scss')
	.pipe(sass())
	.pipe(prefix(['last 20 versions', '> 1%', 'ie 8', "ie 7"]))
	.pipe(gulp.dest('app/css'))
});

gulp.task('img', function() {
	return gulp.src('app/img/**/*')
		.pipe(cache(imagemin({
			interlaced: true,
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		})))
		.pipe(gulp.dest('dist/img'));
});

gulp.task('watch', ['css-min','css-min-style', 'libjs', 'html'], function(){
	gulp.watch('app/html/**/*.html', ['html']);
	gulp.watch('app/sass/**/*.scss', ['sass']);
	gulp.watch('app/css/**/*.css', ['css-min-style']);
	gulp.watch('app/libsjs/*.js', ['libjs']);
});

gulp.task('libjs', function(){
	return gulp.src([
		'app/libs-js/jquery-1.11.0.min.js',
		'app/libs-js/scrollbar.min.js',
		'app/libs-js/slick.min.js',
		
		
//		LIBJS
	])
	.pipe(concat('libs.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('app/js'));
});

gulp.task('minjs', function(){
	return gulp.src([
		'app/js/main.js'
	])
	.pipe(uglify())
	.pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest('dist/js'))
});


gulp.task('css-min', ['sass'], function(){
	return gulp.src('app/css/libs.css')
	.pipe(cssnano())
	.pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest('app/css'));
});


gulp.task('css-min-style', function(){
	return gulp.src('app/css/style.css')
		.pipe(cssnano())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('app/css'));
});


gulp.task('build', ['del', 'minjs', 'img'], function(){
	
	var buildCss = gulp.src([
		'app/css/style.css',
		'app/css/style.min.css',
		'app/css/libs.min.css',
	])
	.pipe(gulp.dest('dist/css'));

	var buildFonts = gulp.src('app/fonts/**/*')
	.pipe(gulp.dest('dist/fonts'));

	var buildJS = gulp.src('app/js/**/*')
	.pipe(gulp.dest('dist/js'));

	var buildHtml = gulp.src('app/*.html')
	.pipe(gulp.dest('dist/'));
});
