module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: ["dist", '.tmp', './app/dist'],

        copy: {
            main: {
                expand: true,
              cwd: 'app/client/',
              src:['**'],
              dest: './app/dist/'
            }
        },

        useminPrepare: {
            html: './app/client/index.html'
        },

        usemin: {
            html: ['./app/dist/index.html']
        },

        uglify: {
            options: {
                report: 'min',
                mangle: true
            },
          files: {
            './app/dist/app.min.js': ['.tmp/concat/app.min.js']
          }
        }

    });

    grunt.Config

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-usemin');

    grunt.registerTask('adjustBuiltLinks', 'Performing Final Cleanups', function() {

        var indexDist='./app/dist/index.html';

        grunt.log.writeln('Performing Final Cleanups');

        var indexContent=grunt.file.read(indexDist);

        //indexContent=indexContent.replace('<link rel="stylesheet" href="app/app.min.css"/>','<link rel="stylesheet" href="app.min.css"/>');

        //indexContent=indexContent.replace('<script src="app/app.min.js"></script>','<script src="app.min.js"></script>');

        grunt.file.write(indexDist, indexContent);

    });



    grunt.registerTask('default', [
       'clean', 'copy', 'useminPrepare', 'concat',  'cssmin', 'usemin','uglify'
    ]);







};
