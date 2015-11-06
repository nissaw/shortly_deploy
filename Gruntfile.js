module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: { 
      options: {
        seperator: ';',
      },
      basic: {
        src: [
          'public/client/*.js',
          // 'app/*/*.js',
          // 'lib/*.js',
          // 'view/*.ejs',
          // 'index.js',
          // 'server.js'
        ],
        dest: 'public/dist/production.js',
      },
      extras: {
        src: [
          'public/lib/*.js',
        ],
        dest: 'public/dist/vendor.js',
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
      build: {
        src: 'public/dist/production.js',
        dest: 'public/dist/production.min.js'
      }
    },

    jshint: {
      // beforeconcat: [ 'public/client/*.js' ],
      // afterconcat: [ 'public/dist/production.js' ],
      files: [
        'public/client/*.js'
        // 'public/dist/production.js' // doesn't seem to have access b/c gitignore
      ],
      options: {
        force: false,
        jshintrc: '.jshintrc',
        ignores: [
          'public/lib/**/*.js',
          'public/dist/**/*.js'
        ],
      }
    },

    cssmin: {
       build: {
         files: {
           'public/dist/css/style.min.css': 'public/*.css'
         }
       }

    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ],
        options: {
          interrupt: true,
        }
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      prodServer: {
        command: 'git push heroku master',
        options: {
          stdout: true,
          stderr: true, 
          failOnError: true
        }
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
         cmd: 'grunt',
         grunt: true,
         args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////


  grunt.registerTask('test', [
    'jshint',
    'mochaTest'
  ]);

  grunt.registerTask('build', ['test', 'concat', 'uglify', 'cssmin',
  ]);

  grunt.registerTask('upload', function(n) {
    if(grunt.option('prod')) {   
      grunt.task.run([ 'shell:prodServer' ]);
    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });

  grunt.registerTask('deploy', [     
    'test',
    'build', 
    'upload'
  ]);

  grunt.registerTask('heroku:production', 'build');

};


