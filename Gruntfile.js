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
	  'lib/core/jquery.js',
	  'lib/core/lodash.js',
	  'lib/core/backbone.js',
	  'lib/core/json2.js',
	  // Libs.
	  'lib/required/{,**}/*.js',
	  'lib/ui/*.js',
	  // Sound manager.
	  'lib/soundmanager/script/soundmanager2.js'
	],
	dist: [
	  // Template and the app.
	  'tpl.js', 'app.js'
	]
      },

      // General settings.
      settings: {
	author: "Jeremy Graham",
	banner: '/*! Chorus 2 - A web interface for Kodi. Created by ' + this.author + ' - built on <%= grunt.template.today("dd-mm-yyyy") %> */\n'
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

      case 'paths':
	return cfg.paths[prop];

      case 'coffeeStack':
	return cfg.coffeeStack;

      // ConcatStack cfg requires a bit more parsing.
      case 'concatStack':
	var stack = [], keys = ['src', 'dist'], key, path, i, p;
	// Loop over groups keys in order of items src/dist.
	for (i in keys) {
	  key = keys[i];
	  // Loop over cfg, prefixing paths with group path and add to the stack.
	  for (p in cfg[type][key]) {
	    // Concat group dir (src/dist) with path.
	    path = cfg.paths[key] + cfg.concatStack[key][p];
	    stack.push([p])
	  }
	}
	// Return stack.
	return stack;
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
        options: {
        }
      },
      images: {
	files: [ggp('themeSrc') + 'images/**']
      },
      css: {
	files: [ggp('themeDist') + 'css/{,**/}*.css']
      },
      eco: {
	files: [ggp('jsSrc') + '/**/*.eco'],
	tasks: ['eco', 'concat']
      },
      coffee: {
	files: [ggp('jsSrc') + '{,**/}*.coffee'],
	tasks: ['coffee', 'concat']
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
	cwd:  ggp('jsSrc'),
	src: ggs('coffeeStack'),
	dest: ggp('jsDist'),
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
	  'dist/js/tpl.js': [ggp('jsSrc') + '**/*.eco']
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
      all: [ggp('jsDist') + 'app.js']
    },

    // Join all the dist files into one place
    concat: {
      options: {
        separator: ';'
      },
      dist: {
	src: ggs('concatStack'),
	dest: ggp('jsDist') + '<%= pkg.name %>.js'
      }
    },

    // Minify - DISABLED (in 'watch' and 'build') until test written.
    uglify: {
      dev: {
        options: {
          mangle: false,
          compress: false,
          beautify: true,
	  banner: ggs('setting', 'banner')
        },
        files: [{
          expand: true,
          flatten: true,
	  cwd: ggp('jsDist'),
	  dest: ggp('jsDist'),
          src: ['**/*.js', '!**/*.min.js'],
          rename: function (dest, src) {
            return dest + '<%= pkg.name %>.min.js';
          }
        }]
      },
      dist: {
        options: {
          mangle: true,
          compress: {},
	  banner: ggs('setting', 'banner')
        },
        files: [{
          expand: true,
          flatten: true,
	  cwd: ggp('jsDist'),
	  dest: ggp('jsDist'),
          src: ['**/*.js', '!**/*.min.js'],
          rename: function (dest, src) {
            return dest + '<%= pkg.name %>.min.js';
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
    'concat',
    'compass:dist'
  ]);

};
