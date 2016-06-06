const Filter = require('../../src/domain/filter')
const Todo = require('../../src/domain/todo')
const TodoCollection = require('../../src/domain/todo-collection')

const {expect} = require('chai')
const {div, ul, button, footer} = require('dom-gen')

let elem
let todoApp
let filterObserver

describe('todo-app', () => {
  beforeEach(() => {
    localStorage.clear()

    elem = div(
      div({attr: {id: 'main'}},
        ul().cc('todo-list'),
        button().cc('todo-toggle-all')
      ),
      footer({attr: {id: 'footer'}},
        ul().cc('todo-filters'),
        div().cc('todo-count')
      )
    )

    todoApp = elem.cc.init('todo-app')

    elem.trigger('filterchange', Filter.ALL)
  })

  describe('on hashchange', () => {
    it('updates view', done => {
      todoApp.updateView = () => done()

      elem.trigger('filterchange', Filter.ALL)
    })
  })

  describe('on todo-new-item', () => {
    it('adds the item of the given title', () => {
      elem.trigger('todo-new-item', 'foo')

      expect(todoApp.todoCollection.toArray()).to.have.length(1)
    })
  })

  describe('on todo-item-toggle', () => {
    it('toggles the item', () => {
      elem.trigger('todo-new-item', 'foo')

      const id = elem.find('.todo-item').attr('id')

      elem.trigger('todo-item-toggle', id)

      const todo = todoApp.todoCollection.getById(id)

      expect(todo.completed).to.be.true
    })

    it('updates the todo list when the filter is not `/all`', done => {
      elem.trigger('todo-new-item', 'foo')
      elem.trigger('filterchange', Filter.ACTIVE)

      todoApp.updateTodoList = () => done()

      const id = elem.find('.todo-item').attr('id')

      elem.trigger('todo-item-toggle', id)
    })
  })

  describe('on todo-item-destroy', () => {
    it('removes the item', () => {
      elem.trigger('todo-new-item', 'foo')
      elem.trigger('todo-new-item', 'bar')

      expect(todoApp.todoCollection.toArray().length).to.equal(2)

      let id = elem.find('.todo-item').attr('id')

      elem.trigger('todo-item-destroy', id)

      expect(todoApp.todoCollection.toArray().length).to.equal(1)

      id = elem.find('.todo-item').attr('id')

      elem.trigger('todo-item-destroy', id)

      expect(todoApp.todoCollection.toArray().length).to.equal(0)
    })
  })

  describe('on todo-item-edited', () => {
    it('saves the edited title', () => {
      elem.trigger('todo-new-item', 'foo')

      const id = elem.find('.todo-item').attr('id')

      elem.trigger('todo-item-edited', [id, 'foobar'])

      expect(todoApp.todoCollection.getById(id).title).to.equal('foobar')
    })
  })

  describe('on todo-clear-completed', () => {
    it('clears the completed todos', () => {
      elem.trigger('todo-new-item', 'foo')
      elem.trigger('todo-new-item', 'bar')

      let id = elem.find('.todo-item').attr('id')

      elem.trigger('todo-item-toggle', id)

      elem.trigger('todo-clear-completed')

      expect(todoApp.todoCollection.toArray().length).to.equal(1)

      id = elem.find('.todo-item').attr('id')

      const todo = todoApp.todoCollection.getById(id)

      expect(todo.title).to.equal('bar')
    })
  })

  describe('on todo-complete-all', () => {
  })

  describe('on todo-uncomplete-all', () => {
  })
})
