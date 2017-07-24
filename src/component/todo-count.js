const {strong} = require('dom-gen')

const {component} = require('capsid')

/**
 * The todo counting element.
 */
@component
class TodoCount {
  /**
   * @param {number} count The number of todos
   */
  setCount (count) {
    this.elem.empty()

    this.elem.append(strong(count), ` item${count === 1 ? '' : 's'} left`)
  }
}

module.exports = TodoCount
