const Const = require('../const')

const {event, component} = $.cc

/**
 * TodoInput class controls the input for adding todos.
 */
void
@component('todo-input')
class {
  /**
   * Handler for key presses.
   * @param {Event}
   */
  @event('keypress')
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
