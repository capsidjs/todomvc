var $ = require('jquery')

var TodoToggleAll = $.cc.subclass(function (pt) {
  'use strict'

  pt.constructor = function (elem) {
    this.elem = elem

    var self = this

    this.elem.on('click', function () {
      self.toggleAll()
    })
  }

  /**
   * Toggles the all items.
   */
  pt.toggleAll = function () {
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
  pt.updateBtnState = function (activeItemExists) {
    this.checked = !activeItemExists

    if (this.checked) {
      this.elem.prop('checked', true)
    } else {
      this.elem.prop('checked', false)
    }
  }
})

$.cc.assign('todo-toggle-all', TodoToggleAll)
