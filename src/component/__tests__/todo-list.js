const { expect } = require('chai')
const { make } = require('capsid')

const { Todo, Filter } = require('../../domain')

const todoFactory = new Todo.Factory()

let el
let todoList

describe('todo-list', () => {
  beforeEach(() => {
    el = document.createElement('div')
    todoList = make('todo-list', el)
  })

  describe('onRefresh', () => {
    it('updates the todo list view by the given todo collection and filter', () => {
      todoList.onRefresh({
        detail: {
          todoCollection: new Todo.Collection([
            todoFactory.createByTitle('foo0'),
            todoFactory.createByTitle('foo1'),
            todoFactory.createByTitle('foo2')
          ]),
          filter: Filter.ALL
        }
      })

      expect(el.querySelectorAll('li').length).to.equal(3)
    })
  })
})
