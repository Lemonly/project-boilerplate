module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        sass: {
            dist: {
                files: {
                    "dev/css/styles.css": "dev/scss/styles.scss"
                }
            }
        },
        watch: {
            livereload: {
                options: { livereload: true },
                files: ['dev/css/*.css', 'dev/js/site/*.js', 'dev/**/*.html']
            },
            sass: {
                files: 'dev/scss/*.scss',
                tasks: ['sass']
            }
        },
        connect: {
            server: {
                options: {
                    port: 8888,
                    hostname: '*',
                    livereload: true,
                    open: true,
                    base: 'dev'
                }
            },
            buildTest: {
                options: {
                    port: 8888,
                    hosthame: '*',
                    open: true,
                    base: 'build',
                    keepalive: true
                }
            }
        },
        copy: {
            main: {
                files: [
                    {
                        expand: true,
                        cwd: 'dev',
                        src: '**',
                        dest: 'build/'
                    }
                ]
            }
        },
        cssmin: {
            combine: {
                files: {
                    'build/css/styles.css': 'dev/css/styles.css'
                }
            }
        },
        uglify: {
            my_target: {
                files: [{
                    expand: true,
                    cwd: 'dev/js/site',
                    src: '**/*.js',
                    dest: 'build/js/site'
                }]
            }
        },
        clean: {
            build: ['build'],
            cleanup: [
                'build/css/*.*.map',
                'build/img/uncompressed',
                'build/scss'
            ]
        },
        cacheBust: {
            options: {
                encoding: 'utf8',
                algorithm: 'md5',
                length: 8,
                baseDir: 'build',
                rename: false,
                ignorePatterns: ['img']
            },
            assets: {
                files: [{
                    src: ['build/*.html'],
                    dest: 'build/'
                }]
            }
        },
        compress: {
            build: {
                options: {
                    archive: 'build.' + dateHash() + '.zip'
                },
                files: [
                    {
                        src: ['build/**'],
                        dest: '/'
                    }
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-cache-bust');
    grunt.loadNpmTasks('grunt-contrib-compress');

    grunt.registerTask('server', [
        'sass',
        'connect:server',
        'watch'
    ]);

    grunt.registerTask('buildTest', [
        'connect:buildTest'
    ]);

    grunt.registerTask('build', [
        'sass',
        'clean:build',
        'copy',
        'cssmin',
        'uglify',
        'clean:cleanup',
        'cacheBust',
        'compress'
    ]);
};

//for zip creation
var dateHash = function() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();

    if(dd<10) {
        dd='0'+dd
    }

    if(mm<10) {
        mm='0'+mm
    }

    var date = yyyy + '-' + mm + '-' + dd + '.' + today.getTime();
    return date;
}
