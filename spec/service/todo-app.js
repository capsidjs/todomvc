const $ = require('jquery')
const {expect} = require('chai')

let elem
let todoApp

describe('todo-app', () => {
  beforeEach(() => {
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

  describe('on todo-new-item', () => {
    it('adds the item of the given title', () => {
      elem.trigger('todo-new-item', 'foo')

      expect(todoApp.todoCollection.toArray()).to.have.length(1)
    })
  })

  describe('on todo-item-toggle', () => {})
  describe('on todo-item-destroy', () => {})
  describe('on todo-item-edited', () => {})
  describe('on todo-clear-completed', () => {})
  describe('on todo-complete-all', () => {})
  describe('on todo-uncomplete-all', () => {})
  describe('on window hashchange', () => {})
})
