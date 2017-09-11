const { make } = require('capsid')
const { expect } = require('chai')

const { Todo } = require('../../domain')
const { ACTION: { TOGGLE_ALL, MODEL_UPDATE } } = require('../../const')

describe('main', () => {
  let main
  let el
  beforeEach(() => {
    el = document.createElement('main')
    el.innerHTML = `
      <input class="toggle-all" type="checkbox" />
      <ul class="todo-list"></ul>
    `
    main = make('main', el)
  })

  describe('on .toggle-all button click', () => {
    it('emits TOGGLE_ALL action', done => {
      el.addEventListener(TOGGLE_ALL, () => done())
      el.querySelector('.toggle-all').click()
    })
  })

  describe('on MODEL_UPDATE', () => {
    it('toggles the toggle-all button according to if there exists any uncompleted todo', () => {
      el.dispatchEvent(new CustomEvent(MODEL_UPDATE, {
        detail: {
          todoCollection: new Todo.Collection([
            new Todo('foo0', 'bar', true),
            new Todo('foo1', 'bar', false),
            new Todo('foo2', 'bar', true)
          ])
        }
      }))

      expect(el.querySelector('.toggle-all').checked).to.equal(false)

      el.dispatchEvent(new CustomEvent(MODEL_UPDATE, {
        detail: {
          todoCollection: new Todo.Collection([
            new Todo('foo0', 'bar', true),
            new Todo('foo1', 'bar', true),
            new Todo('foo2', 'bar', true)
          ])
        }
      }))

      expect(el.querySelector('.toggle-all').checked).to.equal(true)
    })

    it('shows itself if and only if there exists any todo', () => {
      el.dispatchEvent(new CustomEvent(MODEL_UPDATE, {
        detail: {
          todoCollection: new Todo.Collection([
            new Todo('foo0', 'bar', true),
            new Todo('foo1', 'bar', false),
            new Todo('foo2', 'bar', true)
          ])
        }
      }))

      expect(el.style.display).to.not.equal('none')

      el.dispatchEvent(new CustomEvent(MODEL_UPDATE, {
        detail: {
          todoCollection: new Todo.Collection([
          ])
        }
      }))

      expect(el.style.display).to.equal('none')
    })
  })
})
