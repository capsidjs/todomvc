const {strong} = require('dom-gen')

const {component} = $.cc

/**
 * The todo counting element.
 */
void
@component('todo-count')
class {
  /**
   * @param {number} count The number of todos
   */
  setCount (count) {
    this.elem.empty()

    this.elem.append(strong(count), ` item${count !== 1 ? 's' : ''} left`)
  }
}
