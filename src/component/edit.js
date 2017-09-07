const { KEYCODE, ACTION: { EDIT_TODO } } = require('../const')
const { emit, on, component } = require('capsid')

/**
 * TodoEdit controls the edit area of each todo item.
 */
@component
class Edit {
  onStart () {
    this.el.focus()
  }

  /**
   * Updates the view with the given value.
   */
  onUpdate (value) {
    this.el.value = value
    this.el.dataset.prevValue = value
  }

  /**
   * Handler for the key press events.
   *
   * @param {Event} e The event
   */
  @on('keypress')
  @on('keydown')
  onKeypress (e) {
    if (e.which === KEYCODE.ENTER) {
      this.onFinish()
    } else if (e.which === KEYCODE.ESCAPE) {
      this.onCancel()
    }
  }

  /**
   * Finishes editing with current value.
   */
  @on('blur')
  @emit(EDIT_TODO)
  onFinish () {
    const value = this.el.value

    this.onUpdate(value)

    return value
  }

  /**
   * Cancels editing and revert the change of the value.
   */
  @emit(EDIT_TODO)
  onCancel () {
    const value = this.el.dataset.prevValue

    this.onUpdate(value)

    return value
  }
}

module.exports = Edit
