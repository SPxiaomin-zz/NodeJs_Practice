var gulp = require('gulp'),
    watch = require('gulp-watch'),
    livereload = require('gulp-livereload'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat');

var imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    cache = require('gulp-cache');
    
var minifyHtml = require('gulp-htmlmin');
    
var less = require('gulp-less'),
    minifyCSS = require('gulp-minify-css');

var paths = {
    html: ['views/src/*.html'],
    less: ['public/less/**/*.less'],
    images: ['public/images/src/**/*.{png, jpg, gif}']
};

var watcherHtml;
var watcherLess;
var watcherImage;

gulp.task('html', function () {
    return gulp.src(paths.html)
        .pipe(plumber())
        .pipe(minifyHtml({
            removeComments: true, //清除html注释
            collapseWhitespace: true, //压缩html
            removeEmptyAttributes: true, //清除标签中属性值为空的所有属性 <input id="" /> ==> <input />
            removeScriptTypeAttributes: true, //移除 script 标签中的 type="text/javascript"，其它的类型属性保留
            removeStyleLinkTypeAttributes: true, //移除 link 标签中的 type="text/css"，其它的类型属性保留
            minifyJS: true, //压缩页面中的 Javascipt
            minifyCSS: true //压缩页面中的 CSS
        }))
        .pipe(plumber.stop())
        .pipe(gulp.dest('views/dest'))
        .pipe(livereload());
});

gulp.task('images', function () {
    return gulp.src(paths.images)
        .pipe(plumber())
        .pipe(cache(imagemin({
            progressive: true, //类型： Boolean 默认：false 无损压缩jpg图片
            interlaced: true,  //类型： Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true,   //类型： Boolean 默认：false 多次优化svg直到完全优化
            svgoPlugins: [{removeViewBox: false}], //不要移除svg的viewbox属性
            use: [pngquant()] //使用pngquant深度压缩png图片
        })))
        .pipe(plumber.stop())
        .pipe(gulp.dest('public/images/dest'))
        .pipe(livereload());
});

gulp.task('styles', function () {
    return gulp.src(paths.less)
        .pipe(plumber())
        .pipe(less())
        .pipe(plumber.stop())
        .pipe(gulp.dest('public/stylesheets'))
        .pipe(minifyCSS())
        .pipe(rename({
            extname: ".min.css"
        }))
        .pipe(gulp.dest('public/stylesheets'))
        .pipe(livereload());
});

gulp.task('default', ['html', 'styles', 'images'], function () {
    livereload.listen();

    watcherHtml = gulp.watch(paths.html, ['html']);
    watcherHtml.on('change', function (event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });


    watcherLess = gulp.watch(paths.less, ['styles']);
    watcherLess.on('change', function (event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });

    watcherImage = gulp.watch(paths.images, ['images']);
    watcherImage.on('change', function (event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});
