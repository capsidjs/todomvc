var $ = require('jquery')

/**
 * Todo class is the model of single todo item.
 */
var Todo = $.cc.subclass(function (pt) {
  'use strict'

  /**
   * @param {String} id The todo's id
   * @param {String} title The todo's title
   * @param {Boolean} completed The flag indicates if it's done or not
   */
  pt.constructor = function (id, title, completed) {
    this.id = id
    this.title = title
    this.completed = completed
  }
})

module.exports = Todo
