const $ = require('jquery')
const {strong} = require('dom-gen')

class TodoCount {
  constructor (elem) {
    this.elem = elem
  }
  /**
   * @param {number} count The number of todos
   */
  setCount (count) {
    this.elem.empty()

    this.elem.append(strong(count), ` item${ count !== 1 ? 's' : '' } left`)
  }
}

$.cc('todo-count', TodoCount)
