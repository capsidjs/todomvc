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
  })

  describe('on todo-item-destroy', () => {})

  describe('on todo-item-edited', () => {})

  describe('on todo-clear-completed', () => {})

  describe('on todo-complete-all', () => {})

  describe('on todo-uncomplete-all', () => {})
})
