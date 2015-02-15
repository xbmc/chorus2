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

  // Js Dist files.
  var jsDistApp = jsDistFolder + 'app.js';
  var jsDistTpl = jsDistFolder + 'tpl.js';

  // The order of concat files.
  function getConcatStack() {
    return [
      // Libs Core.
      srcFolder + 'lib/core/jquery.js',
      srcFolder + 'lib/core/lodash.js',
      srcFolder + 'lib/core/backbone.js',
      srcFolder + 'lib/core/json2.js',
      // Libs required.
      srcFolder + 'lib/required/{,**}/*.js',
      // Libs ui.
      srcFolder + 'lib/ui/*.js',
      // Sound manager.
      srcFolder + 'lib/soundmanager/script/soundmanager2.js',
      // Templates.
      jsSrcFolder + 'tpl/js/jst.js',
      jsDistTpl,
      // The app.
      jsDistApp
    ];
  }

  // The order of coffee files.
  function getCoffeeStack() {
    return [
      '*.coffee',
      'helpers/{,**}/*.coffee',
      'config/{,**}/*.coffee',
      'entities/{,**}/*.coffee',
      'controllers/{,**}/*.coffee',
      'views/{,**}/*.coffee',
      'components/{,**}/*.coffee',
      'apps/{,**}/*.coffee'
    ];
  }

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
      eco: {
        files: [jsSrcFolder + '/**/*.eco'],
        tasks: ['eco', 'concat', 'uglify:dev']
      },
      coffee: {
        files: [jsSrcFolder + '{,**/}*.coffee'],
        tasks: ['coffee', 'concat', 'uglify:dev']
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
          environment: 'production',
          outputStyle: 'compressed'
        }
      }
    },

    coffee: {
      options: {
        bare: true,
        join: true
      },
      files: {
        expand: true,
        flatten: true,
        cwd: jsSrcFolder,
        src: getCoffeeStack(),
        dest: jsDistFolder,
        rename: function (dest, src) {
          return dest + 'app.js';
        }
      }
    },

    eco: {
      app: {
        options: {
          basePath: jsSrcFolder,
          jstGlobalCheck: false
        },
        files: [{
          'dist/js/tpl.js': [jsSrcFolder + '**/*.eco']
        }]
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
          hostname: "192.168.0.5",
          proxy: "192.168.0.92:8080",
          ports: {
            min: 3102,
            max: 3103
          }
        }
      }
    },

    jshint: {
      options: {
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true,
        },
        unused: false,
        eqnull: true,
        boss: true
      },
      all: [jsDistApp]
    },

    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: getConcatStack(),
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
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-eco');

  /**
   * Tasks
   */
  grunt.registerTask('default', ['browserSync', 'watch']);

  grunt.registerTask('build', [
    'concat',
    'uglify:dist',
    'compass:dist',
    //'jshint'
  ]);

};
