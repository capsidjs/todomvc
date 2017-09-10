import { trigger } from '../../__tests__/helper'

const { expect } = require('chai')
const { div, ul, button, footer, section } = require('dom-gen')

const { Filter } = require('../../domain')
const { ACTION: {
  CHANGE_FILTER,
  CLEAR_COMPLETED,
  DESTROY_TODO,
  FINISH_EDIT_TODO,
  NEW_ITEM,
  TOGGLE_ALL,
  TOGGLE_TODO
} } = require('../../const')

let elem
let todoApp

describe('todoapp', () => {
  beforeEach(() => {
    window.localStorage.clear()

    elem = div(
      section(
        ul().cc('todo-list').addClass('is-model-observer'),
        button().cc('toggle-all')
      ).cc('main is-model-observer'),
      footer(
        { attr: { id: 'footer' } },
        div().cc('todo-count'),
        ul().cc('filters'),
        button().cc('clear-completed')
      ).cc('footer is-model-observer')
    )

    todoApp = elem.cc.init('todoapp')

    trigger(elem, CHANGE_FILTER, Filter.ALL)
  })

  describe('on filterchange', () => {
    it('updates view', done => {
      todoApp.save = () => done()

      trigger(elem, CHANGE_FILTER, Filter.ALL)
    })
  })

  describe('on NEW_ITEM', () => {
    it('adds the item of the given title', () => {
      trigger(elem, NEW_ITEM, 'foo')

      expect(todoApp.todoCollection.toArray()).to.have.length(1)
    })
  })

  describe('on TOGGLE_TODO', () => {
    it('toggles the item', () => {
      trigger(elem, NEW_ITEM, 'foo')

      const id = elem.find('.todo-item').attr('id')

      trigger(elem, TOGGLE_TODO, id)

      const todo = todoApp.todoCollection.getById(id)

      expect(todo.completed).to.be.true()
    })
  })

  describe('on DESTROY_TODO', () => {
    it('removes the item', () => {
      trigger(elem, NEW_ITEM, 'foo')
      trigger(elem, NEW_ITEM, 'bar')

      expect(todoApp.todoCollection.toArray().length).to.equal(2)

      let id = elem.find('.todo-item').attr('id')

      trigger(elem, DESTROY_TODO, id)

      expect(todoApp.todoCollection.toArray().length).to.equal(1)

      id = elem.find('.todo-item').attr('id')

      trigger(elem, DESTROY_TODO, id)

      expect(todoApp.todoCollection.toArray().length).to.equal(0)
    })
  })

  describe('on FINISH_EDIT_TODO', () => {
    it('saves the edited title', () => {
      trigger(elem, NEW_ITEM, 'foo')

      const id = elem.find('.todo-item').attr('id')

      trigger(elem, FINISH_EDIT_TODO, { id, title: 'foobar' })

      expect(todoApp.todoCollection.getById(id).title).to.equal('foobar')
    })
  })

  describe('on CLEAR_COMPLETED', () => {
    it('clears the completed todos', () => {
      trigger(elem, NEW_ITEM, 'foo')
      trigger(elem, NEW_ITEM, 'bar')

      let id = elem.find('.todo-item').attr('id')

      trigger(elem, TOGGLE_TODO, id)

      trigger(elem, CLEAR_COMPLETED)

      expect(todoApp.todoCollection.toArray().length).to.equal(1)

      id = elem.find('.todo-item').attr('id')

      const todo = todoApp.todoCollection.getById(id)

      expect(todo.title).to.equal('bar')
    })
  })

  describe('on TOGGLE_ALL', () => {
    it('completes all the todos when there is an active todo', () => {
      trigger(elem, NEW_ITEM, 'foo')
      trigger(elem, NEW_ITEM, 'bar')

      trigger(elem, TOGGLE_ALL, true)

      todoApp.todoCollection.toArray().forEach(todo => {
        expect(todo.completed).to.be.true()
      })
    })

    it('uncompletes all the todos when there is no active todo', () => {
      trigger(elem, NEW_ITEM, 'foo')
      trigger(elem, NEW_ITEM, 'bar')

      todoApp.todoCollection.toArray().forEach(todo => {
        trigger(elem, TOGGLE_TODO, todo.id)
      })

      trigger(elem, TOGGLE_ALL)

      todoApp.todoCollection.toArray().forEach(todo => {
        expect(todo.completed).to.be.false()
      })
    })
  })
})
