const { route, dispatch } = require('hash-route')

const { ACTION: { CHANGE_FILTER } } = require('../const')
const { Filter } = require('../domain')

const { component, emits } = require('capsid')

/**
 * The observer of the filter and invokes filterchange event when it's changed.
 */
@component
class Router {
  onHashchange () {
    dispatch(this)
  }

  @route
  @emits(CHANGE_FILTER)
  '#/all' () {
    return Filter.ALL
  }

  @route
  @emits(CHANGE_FILTER)
  '#/active' () {
    return Filter.ACTIVE
  }

  @route
  @emits(CHANGE_FILTER)
  '#/completed' () {
    return Filter.COMPLETED
  }

  @route
  @emits(CHANGE_FILTER)
  '*' () {
    return Filter.ALL
  }
}

module.exports = Router
