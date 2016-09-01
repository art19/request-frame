var version = '1.4.3',
    gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    header = require('gulp-header'),
    pkg = require('./package.json'),
    bump = require('gulp-bump'),
    babel = require('gulp-babel'),
    banner = ['/**',
        ' *  <%= pkg.name %> - <%= pkg.description %>',
        ' *    Version:  v<%= pkg.version %>',
        ' *     License:  <%= pkg.license %>',
        ' *      Copyright <%= pkg.author %>',
        ' *        github:  <%= pkg.repository.url %>',
        ' *‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾',
        ' */',
        ''
    ].join('\n'),

    minBanner = ['/**',
        ' * <%= pkg.name %> - <%= pkg.description %>',
        ' * @version v<%= pkg.version %>',
        ' * @license <%= pkg.license %>',
        ' * Copyright <%= pkg.author %>',
        ' */',
        ''
    ].join('\n');

var src = [
    './src/request-frame.js'
];

["amd", "umd", "systemjs", "commonjs"].forEach(function (moduleType) {
    gulp.task(`make-min-${moduleType}`, function() {
        return gulp.src(src)
            .pipe(babel({
                moduleIds: true,
                presets: [
                    ['es2015', { modules: moduleType }]
                ]
            }))
            .pipe(concat(`request-frame.${moduleType}.min.js`))
            .pipe(uglify())
            .pipe(header(minBanner, {
                pkg: pkg
            }))
            .pipe(gulp.dest('./dist'));
    });

    gulp.task(`make-${moduleType}`, function() {
        return gulp.src(src)
            .pipe(babel({
                moduleIds: true,
                presets: [
                    ['es2015', { modules: moduleType }]
                ]
            }))
            .pipe(concat(`request-frame.${moduleType}.js`))
            .pipe(header(banner, {
                pkg: pkg
            }))
            .pipe(gulp.dest('./dist'));
    });
});

gulp.task('make-min', ['make-min-amd', 'make-min-umd', 'make-min-systemjs', 'make-min-commonjs']);
gulp.task('make', ['make-amd', 'make-umd', 'make-systemjs', 'make-commonjs']);

gulp.task('bump', function(){
  gulp.src(['./bower.json','./package.json'])
  .pipe(bump({version: version}))
  .pipe(gulp.dest('./'));
});

gulp.task('default', ['make-min', 'make', 'bump']);
