const $ = require('jquery')

class TodoToggleAll {
  constructor (elem) {
    this.elem = elem

    this.elem.on('click', () => {
      this.toggleAll()
    })
  }

  /**
   * Toggles the all items.
   */
  toggleAll () {
    if (this.checked) {
      this.elem.trigger('todo-uncomplete-all')
    } else {
      this.elem.trigger('todo-complete-all')
    }

    this.check = !this.check
  }

  /**
   * Updates the button state by the given active items' condition.
   *
   * @param {Boolean} activeItemExists true if any active item exists, false otherwise
   */
  updateBtnState (activeItemExists) {
    this.checked = !activeItemExists

    if (this.checked) {
      this.elem.prop('checked', true)
    } else {
      this.elem.prop('checked', false)
    }
  }
}

$.cc('todo-toggle-all', TodoToggleAll)
