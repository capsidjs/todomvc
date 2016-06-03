/* global describe, it, expect, beforeEach */

var $ = require('jquery')
var elem
var todoApp

describe('todo-app', function () {
  'use strict'

  beforeEach(function () {
    elem = $('<div />')

    var main = $('<div id="main">').appendTo(elem)

    $('<ul class="todo-list" />').appendTo(main)
    $('<button class="todo-toggle-all" />').appendTo(main)

    var footer = $('<footer id="footer" />').appendTo(elem)

    $('<ul class="todo-filters" />').appendTo(footer)
    $('<div class="todo-count" />').appendTo(footer)

    $.cc.init(null, elem)

    todoApp = elem.cc.init('todo-app')
  })

  describe('on todo-new-item', function () {
    it('adds the item of the given title', function () {
      elem.trigger('todo-new-item', 'foo')

      expect(todoApp.todoCollection.toArray()).to.have.length(1)
    })
  })

  describe('on todo-item-toggle', function () {})
  describe('on todo-item-destroy', function () {})
  describe('on todo-item-edited', function () {})
  describe('on todo-clear-completed', function () {})
  describe('on todo-complete-all', function () {})
  describe('on todo-uncomplete-all', function () {})
  describe('on window hashchange', function () {})
})
