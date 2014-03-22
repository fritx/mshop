/**
 * Created by fritz on 3/7/14.
 */

module.exports = function (grunt) {
  var apiType = grunt.option('api') || 'static';

  grunt.initConfig({
    clean: {
      tmp: {
        src: 'tmp'
      },
      css: {
        src: ['fonts', 'css']
      },
      js: {
        src: 'js'
      },
      html: {
        src: '*.html'
      }
    },

    jsonlint: {
      json: {
        src: [
          'package.json',
          '.jshintrc',
          '.csslintrc',
          'content/data/**/*.json'
        ]
      }
    },

    copy: {
      css: {
        expand: true,
        cwd: 'bower_components/fontawesome/fonts',
        src: '**',
        dest: 'fonts'
      }
    },

    less: {
      css: {
        files: {
          'tmp/css/main.css': 'src/less/main.less',
          'tmp/css/home.css': 'src/less/home.less',
          'tmp/css/items.css': 'src/less/items.less',
          'tmp/css/detail.css': 'src/less/detail.less',
          'tmp/css/cart.css': 'src/less/cart.less',
          'tmp/css/order.css': 'src/less/order.less',
          'tmp/css/orders.css': 'src/less/orders.less'
        }
      }
    },

    csslint: {
      options: {
        csslintrc: '.csslintrc'
      },
      css: {
        src: [
          'tmp/css/**/*.css',
          '!tmp/css/**/global.*'
        ]
      }
    },

    cssmin: {
      css: {
        files: {
          'tmp/css/main.min.css': 'tmp/css/main.css',
          'tmp/css/home.min.css': 'tmp/css/home.css',
          'tmp/css/items.min.css': 'tmp/css/items.css',
          'tmp/css/detail.min.css': 'tmp/css/detail.css',
          'tmp/css/cart.min.css': 'tmp/css/cart.css',
          'tmp/css/order.min.css': 'tmp/css/order.css',
          'tmp/css/orders.min.css': 'tmp/css/orders.css',
          'tmp/css/global.min.css': [
            'bower_components/fontawesome/css/font-awesome.min.css',
            'bower_components/pure/pure-min.css',
            'bower_components/alertify.js/themes/alertify.core.css',
            'bower_components/alertify.js/themes/alertify.default.css',
            'src/css/pure-skin-pink.css',
            'tmp/css/main.min.css'
          ]
        }
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      js: {
        src: 'src/js/**/*.js'
      }
    },

    uglify: {
      js: {
        files: {
          'tmp/js/global.min.js': [
            'bower_components/underscore/underscore.js',
            'bower_components/async/lib/async.js',
            'bower_components/store.js/store.min.js',
            'bower_components/zeptojs/src/zepto.js',
            'bower_components/zeptojs/src/event.js',
            'bower_components/zeptojs/src/ajax.js',
            'bower_components/zeptojs/src/form.js',
            'bower_components/zeptojs/src/ie.js',
            'bower_components/zeptojs/src/detect.js',
            'bower_components/zeptojs/src/fx.js',
            'bower_components/zeptojs/src/fx_methods.js',
            'bower_components/zeptojs/src/selector.js',
            'bower_components/alertify.js/lib/alertify.min.js',
            'src/js/as-jquery.js',
            'bower_components/jquery.lazyload/jquery.lazyload.min.js',
            'src/js/api/' + apiType + '.js',
            'src/js/main.js'
          ],
          'tmp/js/home.min.js': 'src/js/home.js',
          'tmp/js/items.min.js': 'src/js/items.js',
          'tmp/js/detail.min.js': 'src/js/detail.js',
          'tmp/js/cart.min.js': 'src/js/cart.js',
          'tmp/js/order.min.js': 'src/js/order.js',
          'tmp/js/orders.min.js': 'src/js/orders.js'
        }
      }
    },

    concat: {
      'css': {
        options: {
          separator: '\n'
        },
        files: {
          'css/home-bundle.min.css': [
            'tmp/css/global.min.css', 'tmp/css/home.min.css'
          ],
          'css/items-bundle.min.css': [
            'tmp/css/global.min.css', 'tmp/css/items.min.css'
          ],
          'css/detail-bundle.min.css': [
            'tmp/css/global.min.css', 'tmp/css/detail.min.css'
          ],
          'css/cart-bundle.min.css': [
            'tmp/css/global.min.css', 'tmp/css/cart.min.css'
          ],
          'css/order-bundle.min.css': [
            'tmp/css/global.min.css', 'tmp/css/order.min.css'
          ],
          'css/orders-bundle.min.css': [
            'tmp/css/global.min.css', 'tmp/css/orders.min.css'
          ]
        }
      },
      'js': {
        options: {
          separator: '\n;'
        },
        files: {
          'js/home-bundle.min.js': [
            'tmp/js/global.min.js', 'tmp/js/home.min.js'
          ],
          'js/items-bundle.min.js': [
            'tmp/js/global.min.js', 'tmp/js/items.min.js'
          ],
          'js/detail-bundle.min.js': [
            'tmp/js/global.min.js', 'tmp/js/detail.min.js'
          ],
          'js/cart-bundle.min.js': [
            'tmp/js/global.min.js', 'tmp/js/cart.min.js'
          ],
          'js/order-bundle.min.js': [
            'tmp/js/global.min.js', 'tmp/js/order.min.js'
          ],
          'js/orders-bundle.min.js': [
            'tmp/js/global.min.js', 'tmp/js/orders.min.js'
          ]
        }
      }
    },

    jade: {
      options: {
        pretty: true
      },
      html: {
        files: {
          'index.html': 'src/jade/home.jade',
          'items.html': 'src/jade/items.jade',
          'detail.html': 'src/jade/detail.jade',
          'cart.html': 'src/jade/cart.jade',
          'order.html': 'src/jade/order.jade',
          'orders.html': 'src/jade/orders.jade'
        }
      }
    }
  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('dump', [
    'clean'
  ]);
  grunt.registerTask('clear', [
    'clean:tmp'
  ]);

  grunt.registerTask('check-css', [
    'less', 'csslint', 'clear'
  ]);
  grunt.registerTask('check-json', [
    'jsonlint'
  ]);
  grunt.registerTask('check-js', [
    'jshint'
  ]);
  grunt.registerTask('check', [
    'check-json', 'check-css', 'check-js'
  ]);

  grunt.registerTask('build-css', [
    'copy:css',
    'less', 'cssmin',
    'concat:css'
  ]);
  grunt.registerTask('build-js', [
    'uglify',
    'concat:js'
  ]);
  grunt.registerTask('build-html', [
    'jade'
  ]);
  grunt.registerTask('build', [
    'build-css', 'build-js', 'build-html'
  ]);

  grunt.registerTask('default', [
    'dump',
    'check', 'build',
    'clear'
  ]);
};
