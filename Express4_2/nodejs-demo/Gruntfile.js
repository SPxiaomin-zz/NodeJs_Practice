module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            buildjs: {
                src: ['public/javascripts/src/**/*.js'],
                dest: 'public/javascripts/dest/<%= pkg.name %>.js'
            },
            buildcss: {
                src: ['public/stylesheets/src/**/*.css'],
                dest: 'public/stylesheets/dest/<%= pkg.name %>.css'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: ['<%= concat.buildjs.dest %>'],
                dest: 'public/javascripts/dest/<%= pkg.name %>.min.js'
            }
        },
        cssmin: {
            options: {
                keepSpecialComments: 0
            },
            build: {
                src: ['<%= concat.buildcss.dest %>'],
                dest: 'public/stylesheets/dest/<%= pkg.name %>.min.css'
            }
        },
        jshint: {
            files: ['Gruntfile.js', 'public/javascripts/src/**/*.js'],
        },
        watch: {
            build: {
                files: ['<%= jshint.files %>', '!Gruntfile.js'],
                tasks: ['jshint', 'concat:buildjs', 'uglify']
            },
            buildcss: {
                files: ['public/stylesheets/src/**/*.css'],
                tasks: ['concat:buildcss', 'cssmin']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('test', ['jshint']);

    grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'cssmin']);
};
