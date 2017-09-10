module.exports = config => config.set({
  frameworks: ['mocha', 'browserify'],
  files: ['src{/,/**/}__tests__/*.js'],
  preprocessors: { 'src/**/*': 'browserify' },
  reporters: ['progress', 'coverage'],
  coverageReporter: {type: 'lcov'},
  browserify: {
    debug: true,
    transform: [
      ['babelify', { presets: ['es2015', 'decorators-legacy'], plugins: ['istanbul'] }]
    ]
  },
  browsers: ['Chrome', 'Firefox'],
  singleRun: true
})
