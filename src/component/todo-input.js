var $ = require('jquery')

var Const = require('../const')

/**
 * TodoInput class controls the input for adding todos.
 */
var TodoInput = $.cc.subclass(function (pt) {
  'use strict'

  pt.constructor = function (elem) {
    this.elem = elem

    var self = this

    this.elem.on('keypress', function (e) {
      self.onKeypress(e)
    })
  }

  /**
   * Handler for key presses.
   *
   * @param {Event}
   */
  pt.onKeypress = function (e) {
    if (e.which !== Const.KEYCODE.ENTER) {
      return
    }

    if (!this.elem.val() || !this.elem.val().trim()) {
      return
    }

    var title = this.elem.val().trim()
    this.elem.val('')

    this.elem.trigger('todo-new-item', title)
  }
})

$.cc.assign('todo-input', TodoInput)
