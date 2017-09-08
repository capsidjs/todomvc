const { route, dispatch } = require('hash-route')

const { ACTION: { CHANGE_FILTER } } = require('../const')
const { Filter } = require('../domain')

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
  @emit(CHANGE_FILTER)
  '#/all' () {
    return Filter.ALL
  }

  @route
  @emit(CHANGE_FILTER)
  '#/active' () {
    return Filter.ACTIVE
  }

  @route
  @emit(CHANGE_FILTER)
  '#/completed' () {
    return Filter.COMPLETED
  }

  @route
  @emit(CHANGE_FILTER)
  '*' () {
    return Filter.ALL
  }
}

module.exports = Router
