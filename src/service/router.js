import trigger from '../util/trigger'

const { route, dispatch } = require('hash-route')

const Filter = require('../domain/filter')

const { component, emit } = require('capsid')

/**
 * The observer of the filter and invokes filterchange event when it's changed.
 */
@component
class Router {
  onHashchange () {
    dispatch(this)
  }

  @route
  @emit('filterchange')
  '#/all' () {
    return Filter.ALL
  }

  @route
  @emit('filterchange')
  '#/active' () {
    return Filter.ACTIVE
  }

  @route
  @emit('filterchange')
  '#/completed' () {
    return Filter.COMPLETED
  }

  @route
  @emit('filterchange')
  '*' () {
    return Filter.ALL
  }
}

module.exports = Router
