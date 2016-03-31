'use strict';

module.exports = function (grunt) {

  var cwd = process.cwd();


  /***************************************************
   * Config and config helpers.
   **************************************************/


  /**
   *  An attempt at organising all the variables needed for a build/watch into one object.
   *  Do not access directly, use ggs(), ggp(), etc.
   */
  var cfg = {

    // Where things are stored.
    paths: {

      // Core
      cwd: cwd,
      src: 'src/',
      dist: 'dist/',

      // Theme
      theme: 'themes/base/',
      themeSrc: 'src/themes/base/',
      themeDist: 'dist/themes/base/',

      // Js
      js: 'js/',
      jsSrc: 'src/js/',
      jsDist: 'dist/js/',
      jsBuild: 'dist/js/build/',

      // Lang
      lang: 'src/lang/',
      langDist: 'dist/lang/',
      langSrcStrings: 'src/lang/_strings/*.po',
      langSrcPages: 'src/lang/{,**/}*.md'

    },

    // Includes and order of compiling coffee.
    coffeeStack: [
      '*.coffee',
      'helpers/{,**}/*.coffee',
      'config/{,**}/*.coffee',
      'entities/{,**}/*.coffee',
      'controllers/{,**}/*.coffee',
      'views/{,**}/*.coffee',
      'components/{,**}/*.coffee',
      'apps/{,**}/*.coffee'
    ],

    // Joins all libraries and complied app into a single js file.
    concatStack: {
      src: [
        // Core dependencies.
        'src/lib/core/jquery.js',
        'src/lib/core/lodash.js',
        'src/lib/core/backbone.js',
        'src/lib/core/json2.js',
        // Libs.
        'src/lib/required/{,**}/*.js',
        'src/lib/ui/*.js',
        // Sound manager.
        'src/lib/soundmanager/script/soundmanager2.js'
      ],
      dist: [
        // Libs, template and the app, all minified.
        // TODO: Is it worth the 200K it saves to sacrifice debugging, currently not used
        'dist/js/build/libs.min.js', 'dist/js/build/app.min.js'
      ],
      'dev': [
        // Dev uses non minified and easier to debug..
        'dist/js/build/libs.min.js', 'dist/js/build/app.js'
      ]
    },

    // General settings.
    settings: {
      banner: '/*! Chorus 2 - A web interface for Kodi. Created by Jeremy Graham - built on <%= grunt.template.today("dd-mm-yyyy") %> */\n'
    }

  };


  /**
   * Grunt Get Setting (ggs).
   *
   * Wrapper to get a setting from cfg object.
   *
   * @param type
   *   The type of cfg (eg. path, concatStack).
   * @param prop
   *   The property to fetch (if any).
   */
  function ggs(type, prop) {
    switch (type) {

      case 'concatStack':
      case 'settings':
      case 'paths':
        return cfg[type][prop];

      case 'coffeeStack':
        return cfg.coffeeStack;

    }
  }

  /**
   * Grunt Get Path (ggp).
   * */
  function ggp(prop) {
    return ggs('paths', prop);
  }


  /***************************************************
   *  Main Grunt task.
   **************************************************/


  /**
   *  Grunt Config.
   */
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // Watch these files, if they change, run tasks.
    watch: {
      options: {
        // Make sure the watch task can find this Gruntfile even if the grunt
        // file base is changed.
        cliArgs: ['--gruntfile', require('path').join(cwd, 'Gruntfile.js')]
      },
      sass: {
        files: [ggp('themeSrc') + 'sass/{,**/}*.{scss,sass}'],
        tasks: ['compass:dev'],
        options: {}
      },
      images: {
        files: [ggp('themeSrc') + 'images/**']
      },
      css: {
        files: [ggp('themeDist') + 'css/{,**/}*.css']
      },
      eco: {
        files: [ggp('jsSrc') + '/**/*.eco'],
        tasks: ['eco', 'concat:libs', 'uglify:libs', 'concat:dev']
      },
      coffee: {
        files: [ggp('jsSrc') + '{,**/}*.coffee'],
        tasks: ['coffee', 'concat:dev']
      },
      po2json: {
        files: [ggp('langSrcStrings')],
        tasks: ['po2json']
      },
      copyLang: {
        files: ['readme.md', 'changelog.txt', 'src/lang/readme.md'],
        tasks: ['copy:lang', 'marked']
      },
      marked: {
        files: [ggp('langSrcPages')],
        tasks: ['marked']
      },
      libs: {
        files: [ggs('concatStack', 'src')],
        tasks: ['concat:libs', 'uglify:libs', 'concat:dev']
      }
    },

    // Compile compass.
    compass: {
      options: {
        config: ggp('themeSrc') + 'config.rb',
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

    // Compile coffee.
    coffee: {
      options: {
        bare: true,
        join: true
      },
      files: {
        expand: true,
        flatten: true,
        cwd: ggp('jsSrc'),
        src: ggs('coffeeStack'),
        dest: ggp('jsBuild'),
        rename: function (dest, src) {
          return dest + 'app.js';
        }
      }
    },

    // Compile all the *.eco templates into a single tpl.js
    eco: {
      app: {
        options: {
          basePath: ggp('jsSrc'),
          jstGlobalCheck: false
        },
        files: [{
          'dist/js/build/tpl.js': [ggp('jsSrc') + '**/*.eco']
        }]
      }
    },

    // Injects css changes automatically and sync interaction between browsers.
    // TODO: Move proxy details to envvar file or similar.
    browserSync: {
      dev: {
        bsFiles: {
          src: ggp('themeDist') + 'css/{,**/}*.css'
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

    // Parse for errors - DISABLED as conflicts with coffee.
    jshint: {
      options: {
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        },
        unused: false,
        eqnull: true,
        boss: true
      },
      all: [ggp('jsBuild') + 'app.js']
    },

    // Concat the libs for uglify and build final JS file.
    concat: {
      options: {
        separator: ';'
      },
      libs: {
        src: ggs('concatStack', 'src'),
        dest: ggp('jsBuild') + 'libs.js'
      },
      dist: {
        src: ggs('concatStack', 'dist'),
        dest: ggp('jsDist') + '<%= pkg.name %>.js'
      },
      dev: {
        src: ggs('concatStack', 'dev'),
        dest: ggp('jsDist') + '<%= pkg.name %>.js'
      }
    },

    // Minify - Only used for libs.
    uglify: {
      libs: {
        options: {
          mangle: true,
          compress: {},
          banner: ggs('settings', 'banner')
        },
        files: [{
          expand: true,
          flatten: true,
          cwd: ggp('jsBuild'),
          dest: ggp('jsBuild'),
          src: ['libs.js', 'tpl.js'],
          rename: function (dest, src) {
            return dest + 'libs.min.js';
          }
        }]
      },
      app: {
        options: {
          mangle: false,
          compress: {},
        },
        files: [{
          expand: true,
          flatten: true,
          cwd: ggp('jsBuild'),
          dest: ggp('jsBuild'),
          src: ['app.js'],
          rename: function (dest, src) {
            return dest + 'app.min.js';
          }
        }]
      }
    },

    // Convert *.po files into *.json for jed.
    po2json: {
      options: {
        format: 'jed1.x',
        domain: 'messages'
      },
      all: {
        src: [ggp('langSrcStrings')],
        dest: ggp('langDist') + '_strings/'
      }
    },

    // Convert md files to html.
    marked: {
      options: {
        // Wrap code blocks in a <pre>.
        highlight: function (code) {
          return '<pre>' + code + '</pre>';
        },
        tables: true,
        breaks: false
      },
      dist: {
        // Convert and copy src/lang/LANG/*.md to dist/lang/LANG/*.html while
        // preserving folder/lang structure.
        files: [{
          expand: true,
          cwd: 'src/lang',
          src: ['{,**/}*.md', '!readme.md'],
          dest: ggp('langDist'),
          ext: '.html'
        }]
      }
    },

    // Copy a file.
    copy: {
      // Copy the readme, changelog and lang readme to the english lang folder
      // for translating and converting to html.
      lang: {
        files: [
          {src: 'readme.md', dest: 'src/lang/en/app-readme.md'},
          {src: 'changelog.txt', dest: 'src/lang/en/app-changelog.md'},
          {src: 'src/lang/readme.md', dest: 'src/lang/en/lang-readme.md'}
        ]
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
  grunt.loadNpmTasks('grunt-po2json');
  grunt.loadNpmTasks('grunt-marked');
  grunt.loadNpmTasks('grunt-contrib-copy');

  /**
   * Tasks
   *
   * Use via command line with "grunt TASKNAME"
   * Eg "grunt lang" will rebuild languages.
   */

    // Development watch task.
  grunt.registerTask('default', ['browserSync:dev', 'watch']);

  // Languages (strings and pages) only.
  grunt.registerTask('lang', ['copy:lang', 'po2json', 'marked']);

  // Full build of all.
  grunt.registerTask('build', [
    'po2json',
    'copy:lang',
    'marked',
    'eco',
    'coffee',
    'concat:libs',
    'uglify:libs',
    // 'uglify:app', // Uncomment if concat:dist is used.
    'concat:dev', // App is not minified for in the wild debugging. Change to concat:dist to save ~200K
    'compass:dist'
  ]);

};
