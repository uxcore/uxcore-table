// https://github.com/gulpjs/gulp/tree/master/docs
var gulp = require('gulp');
var fs = require('fs');

var webpack = require('webpack');

// http://browsersync.io/
var browserSync = require('browser-sync');
var reload = browserSync.reload;

// https://www.npmjs.com/package/gulp-less
var less = require('gulp-less');

// https://github.com/floridoo/gulp-sourcemaps
var sourcemaps = require('gulp-sourcemaps');

// https://github.com/wearefractal/gulp-concat
var concat = require('gulp-concat');

// https://www.npmjs.com/package/gulp-just-replace/
var replace = require('gulp-just-replace');

gulp.task('pack_demo', function(cb) {
    webpack(require('./webpack.dev.js'), function (err, stats) {
        // 重要 打包过程中的语法错误反映在stats中
        console.log('webpack log:' + stats);
        if(err) cb(err);
        console.info('###### pack_demo done ######');
        cb();
    });
});

gulp.task('less_demo', function(cb) {
    gulp.src(['./demo/**/*.less'])
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(concat('demo.css'))
        .pipe(replace([{
            search: /\/\*#\ssourceMappingURL=([^\*\/]+)\.map\s\*\//g,
            replacement: '/* end for `$1` */\n'
        }]))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./dist'));
    console.info('###### less_demo done ######');
    cb();
});

gulp.task('reload_by_js', ['pack_demo'], function () {
    reload();
});

gulp.task('reload_by_component_css', ['less_component'], function () {
    reload();
});

gulp.task('reload_by_demo_css', ['less_demo'], function () {
    reload();
});

gulp.task('server', [
    'pack_demo',
    'less_demo'
], function() {
    browserSync({
        server: {
            baseDir: './'
        },
        open: 'external'
    });

    gulp.watch(['src/**/*.js', 'demo/**/*.js'], ['reload_by_js']);

    gulp.watch('src/**/*.less', ['reload_by_demo_css']);

    gulp.watch('demo/**/*.less', ['reload_by_demo_css']);

});
