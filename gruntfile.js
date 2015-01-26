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
                files: ['dev/css/*.css', 'dev/js/*.js', 'dev/index.html']
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
                    open: true
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
                    'build/css/styles.min.css': 'build/css/styles.css'
                }
            }
        },
        concat: {
            build: {
                src: ['build/js/app.js'],
                dest: 'build/js/concat.js'
            }
        },
        uglify: {
            my_target: {
                files: {
                    'build/js/app.min.js': 'build/js/concat.js'
                }
            }
        },
        clean: {
            build: ['build'],
            cleanup: [
                'build/js/*.js',
                '!build/js/*.min.js',
                'build/css/styles.css',
                'build/css/*.map',
                'build/img/uncompressed',
                'build/scss'
            ],
            afterCacheBust: [
                'build/js/*.min.js',
                'build/css/*.min.css'
            ]
        },
        replace: {
            sources: {
                src: ['build/index.html'],
                dest: 'build/index.html',
                replacements: [{
                    from: /\"js\/[a-z,0-9,.]*.js\"/g,
                    to: function(matchedWord) {
                        if(matchedWord.indexOf('.min.js') == -1) {
                            console.log(matchedWord);
                            return matchedWord.replace('.js', '.min.js');
                        }
                        return matchedWord;
                    }
                },{
                    from: /\"css\/[a-z,0-9,.]*.css\"/g,
                    to: function(matchedWord) {
                        if(matchedWord.indexOf('.min.css') == -1) {
                            console.log(matchedWord);
                            return matchedWord.replace('.css', '.min.css');
                        }
                        return matchedWord;
                    }
                },{
                    from: 'favicon.ico',
                    to: 'favicon.' + Math.floor((Math.random()*10000000)+1) + '.ico'
                }]
            }
        },
        cacheBust: {
            options: {
                encoding: 'utf8',
                algorithm: 'md5',
                length: 8,
                baseDir: 'build',
                ignorePatterns: ['img']
            },
            assets: {
                files: [{
                    src: ['build/index.html']
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-cache-bust');

    grunt.registerTask('server', [
        'connect:server',
        'watch'
    ]);

    grunt.registerTask('build', [
        'clean:build',
        'copy',
        'cssmin',
        'concat',
        'uglify',
        'clean:cleanup',
        'replace',
        'cacheBust',
        'clean:afterCacheBust'
    ]);
};
