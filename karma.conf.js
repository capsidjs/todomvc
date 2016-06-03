module.exports = config => config.set({
  frameworks: ['mocha', 'browserify'],
  files: ['spec/helper.js', 'spec/**/*'],
  preprocessors: {'spec/**/*': 'browserify'},
  reporters: ['progress', 'coverage'],
  coverageReporter: {type: 'lcov'},
  browserify: {
    debug: true,
    transform: [require('browserify-istanbul')({
      instrumenter: require('isparta'),
      ignore: ['**/spec/**/*', '**/src/*']
    }), 'babelify']
  },
  port: 9876,
  colors: true,
  logLevel: config.LOG_INFO,
  autoWatch: false,
  browsers: ['Chrome'],
  singleRun: true
})
