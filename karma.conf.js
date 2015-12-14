// Karma configuration for unit tests

module.exports = function (config) {
    config.set({
        // base path, that will be used to resolve files and exclude
        basePath: '',

        // frameworks to use
        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files: [
          'app/vendor/jquery/dist/jquery.js',
          'app/vendor/angular/angular.js',
          'app/vendor/angular-route/angular-route.js',
          'app/vendor/angular-mocks/angular-mocks.js',
          'app/vendor/d3/d3.js',
          'app/app.js', 
          'app/directives.js',
          'app/factories.js',
          'app/controllers.js',
          'app/components/**/*.html',
          'app/components/**/*.js',
          'app/services/*.js'
        ],

        // list of files to exclude
        exclude: [],

        // test results reporter to use
        // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
        reporters: ['progress'],

        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_DEBUG,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: ['Chrome','Firefox','IE','PhantomJS'],

        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 60000,

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: true,

        preprocessors: {
            'app/components/**/*.html': 'ng-html2js'
        },

        ngHtml2JsPreprocessor: {
            stripPrefix: 'app/',
            moduleName: 'ng'
        }
    });
};
