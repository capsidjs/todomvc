const { expect } = require('chai')
const { div } = require('dom-gen')

const { Todo, Filter } = require('../../domain')

const todoFactory = new Todo.Factory()

let todoList

describe('todo-list', () => {
  beforeEach(() => {
    todoList = div().cc.init('todo-list')
  })

  describe('onRefresh', () => {
    it('updates the todo list view by the given todo collection and filter', () => {
      todoList.onRefresh({ detail: { todoCollection: new Todo.Collection([
        todoFactory.createByTitle('foo0'),
        todoFactory.createByTitle('foo1'),
        todoFactory.createByTitle('foo2')
      ]), filter: Filter.ALL } })

      expect(todoList.elem.find('li')).to.have.length(3)
    })
  })
})
