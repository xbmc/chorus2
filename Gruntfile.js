'use strict';

module.exports = function (grunt) {

  // Paths.
  var cwd = process.cwd();
  var srcFolder = 'src/';
  var distFolder = 'dist/';

  // Theme folders.
  var themeFolder = 'themes/base/';
  var themeSrcFolder = srcFolder + themeFolder;
  var themeDistFolder = distFolder + themeFolder;

  // Js Folders.
  var jsFolder = 'js/';
  var jsSrcFolder = srcFolder + jsFolder;
  var jsDistFolder = distFolder + jsFolder;
  var jsLibFolder = srcFolder + 'lib/{,**/}';

  // Grunt Config.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      options: {
        // Make sure the watch task can find this Gruntfile even if the grunt
        // file base is changed.
        cliArgs: ['--gruntfile', require('path').join(cwd, 'Gruntfile.js')]
      },
      sass: {
        files: [themeSrcFolder + 'sass/{,**/}*.{scss,sass}'],
        tasks: ['compass:dev'],
        options: {
        }
      },
      images: {
        files: [themeSrcFolder + 'images/**']
      },
      css: {
        files: [themeDistFolder + 'css/{,**/}*.css']
      },
      js: {
        files: ['Gruntfile.js', jsSrcFolder + '{,**/}*.js', '!' + jsSrcFolder + '{,**/}*.min.js', jsLibFolder + '*.js', '!' + jsLibFolder + '*.min.js'],
        tasks: ['jshint', 'concat', 'uglify:dev']
      }
    },

    compass: {
      options: {
        config: themeSrcFolder + 'config.rb',
        bundleExec: true,
        force: true
      },
      dev: {
        options: {
          environment: 'development'
        }
      },
      dist: {
        options: {
          environment: 'production'
        }
      }
    },

    browserSync: {
      dev: {
        bsFiles: {
          src: themeDistFolder + 'css/**/*.css'
        },
        options: {
          watchTask: true,
          injectChanges: true,
          ports: {
            min: 3102,
            max: 3103
          }
        }
      }
    },

    jshint: {
      options: {
        jshintrc: jsSrcFolder + '.jshintrc',
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      },
      all: [jsSrcFolder + '{,**/}*.js', '!' + jsSrcFolder + '{,**/}*.min.js']
    },

    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: [
          // Libs. 
          srcFolder + 'lib/required/*.js',
          // App.
          jsSrcFolder + '*.js',
        ],
        dest: jsDistFolder + '<%= pkg.name %>.js'
      }
    },

    uglify: {
      dev: {
        options: {
          mangle: false,
          compress: false,
          beautify: true,
          banner: '/*! <%= pkg.name %> by Jeremy Graham - built on <%= grunt.template.today("dd-mm-yyyy") %> */\n'
        },
        files: [{
          expand: true,
          flatten: true,
          cwd: jsDistFolder,
          dest: jsDistFolder,
          src: ['**/*.js', '!**/*.min.js'],
          rename: function (dest, src) {
            return dest + '<%= pkg.name %>.min.js';
          }
        }]
      },
      dist: {
        options: {
          mangle: true,
          compress: true,
          banner: '/*! <%= pkg.name %> by Jeremy Graham - built on <%= grunt.template.today("dd-mm-yyyy") %> */\n'
        },
        files: [{
          expand: true,
          flatten: true,
          cwd: jsDistFolder,
          dest: jsDistFolder,
          src: ['**/*.js', '!**/*.min.js'],
          rename: function (dest, src) {
            return dest + '<%= pkg.name %>.min.js';
          }
        }]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-browser-sync');

  /**
   * Tasks
   */
  grunt.registerTask('default', ['browserSync', 'watch']);

  grunt.registerTask('build', [
    'concat',
    'uglify:dist',
    'compass:dist',
    'jshint'  
  ]);

};
