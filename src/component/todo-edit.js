const $ = require('jquery')

const Const = require('../const')

/**
 * TodoEdit controls the edit area of each todo item.
 */
class TodoEdit {
  constructor (elem) {
    this.elem = elem

    this.initEvents()
  }

  /**
   * Initializes the events
   *
   * @private
   */
  initEvents () {
    this.elem.on('keypress', e => {
      this.onKeypress(e)
    })

    this.elem.on('blur', () => {
      this.stopEditing()
    })
  }

  /**
   * Handler for the key press events.
   *
   * @param {Event} e The event
   */
  onKeypress (e) {
    if (e.which === Const.KEYCODE.ENTER) {
      this.stopEditing()
    }
  }

  /**
   * Stops editing with current value.
   */
  stopEditing () {
    this.elem.trigger('todo-edited', this.elem.val())
  }
}

$.cc.assign('todo-edit', TodoEdit)
