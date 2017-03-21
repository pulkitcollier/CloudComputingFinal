var gulp = require('gulp');
var del = require('del');

var paths = {
    clean: ['dist/**', '!dist', '!dist/package.json', '!dist/node_modules', '!dist/node_modules/**']
};

gulp.task('default', ['clean']);

gulp.task('clean', function () {
    return del(paths.clean);
});
