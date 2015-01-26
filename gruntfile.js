module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        sass: {
            dist: {
                files: {
                    "css/styles.css": "scss/styles.scss"
                }
            }
        },
        watch: {
            livereload: {
                options: { livereload: true },
                files: ['css/*.css', 'js/*.js', 'index.html']
            },
            sass: {
                files: 'scss/*.scss',
                tasks: ['sass']
            }
        },
        uglify: {
            my_target: {
                files: {
                    'js/app.min.js': 'js/app.js'
                }
            }
        },
        cssmin: {
            combine: {
                files: {
                    'css/styles.min.css': 'css/styles.css'
                }
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
        }
    });

    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.registerTask('server', [
        'connect:server',
        'watch'
    ]);
};
