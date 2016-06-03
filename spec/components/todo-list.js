/* global describe, it, expect, beforeEach */

var $ = require('jquery')

var TodoCollection = require('../../src/domain/todo-collection')
var TodoFactory = require('../../src/domain/todo-factory')
var todoFactory = new TodoFactory()

var todoList

describe('todo-list', function () {
  'use strict'

  beforeEach(function () {
    todoList = $('<div />').cc.init('todo-list')
  })

  describe('update', function () {
    it('updates the todo list view by the given todo array', function () {
      todoList.update(new TodoCollection([
        todoFactory.createByTitle('foo0'),
        todoFactory.createByTitle('foo1'),
        todoFactory.createByTitle('foo2')
      ]))

      expect(todoList.elem.find('li')).to.have.length(3)
    })
  })
})
