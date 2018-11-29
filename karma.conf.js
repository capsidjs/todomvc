module.exports = config =>
  config.set({
    frameworks: ['mocha', 'browserify'],
    files: ['src{/,/**/}__tests__/*.js'],
    preprocessors: { 'src/**/*': 'browserify' },
    reporters: ['progress', 'coverage'],
    coverageReporter: { type: 'lcov' },
    browserify: {
      debug: true,
      transform: [
        [
          'babelify',
          {
            presets: ['@babel/preset-env'],
            plugins: [
              [
                '@babel/plugin-proposal-decorators',
                { decoratorsBeforeExport: false }
              ],
              '@babel/plugin-proposal-class-properties',
              'istanbul'
            ]
          }
        ]
      ]
    },
    browsers: ['Chrome', 'Firefox'],
    singleRun: true
  })
