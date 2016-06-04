const $ = require('jquery')

const Const = require('../const')

/**
 * TodoInput class controls the input for adding todos.
 */
class TodoInput {
  constructor (elem) {
    this.elem = elem

    this.elem.on('keypress', e => {
      this.onKeypress(e)
    })
  }

  /**
   * Handler for key presses.
   * @param {Event}
   */
  onKeypress (e) {
    if (e.which !== Const.KEYCODE.ENTER) {
      return
    }

    if (!this.elem.val() || !this.elem.val().trim()) {
      return
    }

    const title = this.elem.val().trim()
    this.elem.val('')

    this.elem.trigger('todo-new-item', title)
  }
}

$.cc.assign('todo-input', TodoInput)
