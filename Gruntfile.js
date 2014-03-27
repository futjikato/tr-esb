module.exports = function (grunt) {
	'use strict';

    require('load-grunt-tasks')(grunt);

    // Project configuration
    grunt.initConfig({
        // Task configuration
        jshint: {
            options: {
                jshintrc: true
            },
            lib: {
                src: ['src/**/*.js']
            }
        },
        watch: {
            lib: {
                files: '<%= jshint.lib.src %>',
                tasks: ['jshint:lib']
            }
        },
        vows: {
            all: {
                options: {
                    reporter: "spec"
                },
                src: ["test/*.js"]
            }
        }
    });

    // Default task
    grunt.registerTask('default', ['watch']);

    grunt.registerTask('build', ['jshint', 'vows']);
};