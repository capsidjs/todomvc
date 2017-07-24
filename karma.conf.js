module.exports = config => config.set({
  frameworks: ['mocha', 'browserify'],
  files: ['test/helper.js', 'test/**/*'],
  preprocessors: {'test/**/*': 'browserify'},
  reporters: ['progress', 'coverage'],
  coverageReporter: {type: 'lcov'},
  browserify: {
    debug: true,
    transform: [['babelify', {presets: ['es2015', 'decorators-legacy'], plugins: ['istanbul']}]]
  },
  browsers: ['Chrome', 'Firefox'],
  singleRun: true
})
