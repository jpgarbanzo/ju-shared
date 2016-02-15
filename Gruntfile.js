module.exports = function(grunt) {
    grunt.initConfig({
        jsRootDir : '../public/js',
        jscs : {
            src : grunt.option('files') || [
                '<%= jsRootDir %>/**/*.js',
                '!<%= jsRootDir %>/**/vendor/**/*.js',
                'Gruntfile.js'
            ],
            options : {
                config : '.jscsrc',
                fix : !!(grunt.option('fix'))
            }
        },

        mochaTest : {
            test : {
                src : [
                    'test/*.js'
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-jscs');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-newer');

    grunt.registerTask('test', [
            'newer:jscs',
            'mochaTest'
        ]
    );
};
