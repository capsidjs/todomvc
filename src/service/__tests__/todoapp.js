const { trigger } = require('../../__tests__/helper')

const { expect } = require('chai')
const { make, prep } = require('capsid')

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

let el
let todoApp

describe('todoapp', () => {
  beforeEach(() => {
    window.localStorage.clear()

    el = document.createElement('div')

    el.innerHTML = `
      <section class="main">
        <ul class="todo-list is-model-observer"></ul>
        <button class="toggle-all"></button>
      </section>
      <footer class="footer" id="footer">
        <div class="todo-count"></div>
        <ul class="filters"></ul>
        <button class="clear-completed"></button>
      </footer>
    `
    prep(null, el)

    todoApp = make('todoapp', el)

    trigger(el, CHANGE_FILTER, Filter.ALL)
  })

  describe('on filterchange', () => {
    it('updates view', done => {
      todoApp.save = () => done()

      trigger(el, CHANGE_FILTER, Filter.ALL)
    })
  })

  describe('on NEW_ITEM', () => {
    it('adds the item of the given title', () => {
      trigger(el, NEW_ITEM, 'foo')

      expect(todoApp.todoCollection.length).to.equal(1)
    })
  })

  describe('on TOGGLE_TODO', () => {
    it('toggles the item', () => {
      trigger(el, NEW_ITEM, 'foo')

      const id = el.querySelector('.todo-item').getAttribute('id')

      trigger(el, TOGGLE_TODO, id)

      const todo = todoApp.todoCollection.getById(id)

      expect(todo.completed).to.equal(true)
    })
  })

  describe('on DESTROY_TODO', () => {
    it('removes the item', () => {
      trigger(el, NEW_ITEM, 'foo')
      trigger(el, NEW_ITEM, 'bar')

      expect(todoApp.todoCollection.length).to.equal(2)

      let id = el.querySelector('.todo-item').getAttribute('id')

      trigger(el, DESTROY_TODO, id)

      expect(todoApp.todoCollection.length).to.equal(1)

      id = el.querySelector('.todo-item').getAttribute('id')

      trigger(el, DESTROY_TODO, id)

      expect(todoApp.todoCollection.length).to.equal(0)
    })
  })

  describe('on FINISH_EDIT_TODO', () => {
    it('saves the edited title', () => {
      trigger(el, NEW_ITEM, 'foo')

      const id = el.querySelector('.todo-item').getAttribute('id')

      trigger(el, FINISH_EDIT_TODO, { id, title: 'foobar' })

      expect(todoApp.todoCollection.getById(id).title).to.equal('foobar')
    })
  })

  describe('on CLEAR_COMPLETED', () => {
    it('clears the completed todos', () => {
      trigger(el, NEW_ITEM, 'foo')
      trigger(el, NEW_ITEM, 'bar')

      let id = el.querySelector('.todo-item').getAttribute('id')

      trigger(el, TOGGLE_TODO, id)

      trigger(el, CLEAR_COMPLETED)

      expect(todoApp.todoCollection.length).to.equal(1)

      id = el.querySelector('.todo-item').getAttribute('id')

      const todo = todoApp.todoCollection.getById(id)

      expect(todo.title).to.equal('bar')
    })
  })

  describe('on TOGGLE_ALL', () => {
    it('completes all the todos when there is an active todo', () => {
      trigger(el, NEW_ITEM, 'foo')
      trigger(el, NEW_ITEM, 'bar')

      trigger(el, TOGGLE_ALL, true)

      todoApp.todoCollection.forEach(todo => {
        expect(todo.completed).to.equal(true)
      })
    })

    it('uncompletes all the todos when there is no active todo', () => {
      trigger(el, NEW_ITEM, 'foo')
      trigger(el, NEW_ITEM, 'bar')

      todoApp.todoCollection.forEach(todo => {
        trigger(el, TOGGLE_TODO, todo.id)
      })

      trigger(el, TOGGLE_ALL)

      todoApp.todoCollection.forEach(todo => {
        expect(todo.completed).to.equal(false)
      })
    })
  })
})
