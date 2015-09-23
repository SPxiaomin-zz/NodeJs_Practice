var gulp = require('gulp');

gulp.task('watch', function () {
    gulp.watch('public/stylesheets/style.css', function (event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});

gulp.task('default', function () {
    console.log('hello world!');
});
