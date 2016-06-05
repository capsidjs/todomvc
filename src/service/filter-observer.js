const Filter = require('../domain/filter')

const {component} = require('class-component')

/**
 * The observer of the filter and invokes filterchange event when it's changed.
 */
void
@component('filter-observer')
class {
  constructor(elem) {
    $(window).on('hashchange', () => {
      elem.trigger('filterchange', this.getCurrentFilter())
    })
  }

  getCurrentFilter() {
    const name = window.location.hash.substring(1)

    if (name === Filter.ACTIVE.name) {
      return Filter.ACTIVE
    } else if (name === Filter.COMPLETED.name) {
      return Filter.COMPLETED
    } else {
      return Filter.ALL
    }
  }
}
