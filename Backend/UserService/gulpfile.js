var gulp = require('gulp');
var del = require('del');
var zip = require('gulp-zip');
var lambda = require('gulp-lambda-deploy');

let params = {
    name: 'UserService',
    role: 'arn:aws:iam::472999334680:role/cc-lambda'
};

let options = {
    profile: 'cc',
    region: 'us-east-1'
};

var paths = {
    out: ['dist/**', '!dist', '!dist/package.json', '!dist/node_modules', '!dist/node_modules/**'],
    zip: ['dist/**']
};

gulp.task('clean', function () {
    return del(paths.out);
});

gulp.task('zip', function () {
    return gulp.src(paths.zip)
        .pipe(zip('lambda.zip'))
        .pipe(gulp.dest('./'));
});

gulp.task('upload', function () {
    return gulp.src('./lambda.zip')
        .pipe(lambda(params, options));
});
