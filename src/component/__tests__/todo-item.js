const { expect } = require('chai')
const { make } = require('capsid')
const { trigger } = require('../../__tests__/helper')
const { ACTION: {
  DESTROY_TODO,
  EDIT_TODO,
  FINISH_EDIT_TODO,
  TOGGLE_TODO
} } = require('../../const')

let todoItem
let el
let parentElem

describe('todo-item', () => {
  beforeEach(() => {
    parentElem = document.createElement('ul')

    el = document.createElement('li')
    parentElem.appendChild(el)

    todoItem = make('todo-item', el)

    todoItem.update({
      id: 'foo',
      title: 'bar',
      completed: false
    })
  })

  it('initializes its content html', () => {
    expect(el.querySelector('.view')).to.not.equal(null)
    expect(el.querySelector('.view input.toggle[type="checkbox"]')).to.not.equal(null)
    expect(el.querySelector('.view label')).to.not.equal(null)
    expect(el.querySelector('.view button.destroy')).to.not.equal(null)
    expect(el.querySelector('input.edit')).to.not.equal(null)
  })

  describe('update', () => {
    it('updates the content by the given todo object', () => {
      expect(el.getAttribute('id')).to.equal('foo')
      expect(el.querySelector('label').textContent).to.equal('bar')
      expect(el.querySelector('.edit').value).to.equal('bar')
      expect(el.classList.contains('completed')).to.equal(false)
      expect(el.querySelector('.toggle').checked).to.equal(false)

      todoItem.update({
        id: 'foo1',
        title: 'bar1',
        completed: true
      })

      expect(el.getAttribute('id')).to.equal('foo1')
      expect(el.querySelector('label').textContent).to.equal('bar1')
      expect(el.querySelector('.edit').value).to.equal('bar1')
      expect(el.classList.contains('completed')).to.equal(true)
      expect(el.querySelector('.toggle').checked).to.equal(true)
    })
  })

  describe('on .toggle click', () => {
    it('emits TOGGLE_TODO event', done => {
      el.addEventListener(TOGGLE_TODO, ({ detail: id }) => {
        expect(id).to.equal('foo')
        done()
      })

      el.querySelector('.toggle').click()
    })
  })

  describe('on .destroy click', () => {
    it('triggers DESTROY_TODO event', done => {
      el.addEventListener(DESTROY_TODO, ({ detail: id }) => {
        expect(id).to.equal('foo')

        done()
      })

      el.querySelector('.destroy').click()
    })
  })

  describe('on label dblclick', () => {
    it('adds editing class to the element', () => {
      trigger(el.querySelector('label'), 'dblclick')

      expect(el.classList.contains('editing')).to.equal(true)
    })
  })

  describe('on EDIT_TODO event', () => {
    it('removes editing class', () => {
      trigger(el.querySelector('label'), 'dblclick')

      expect(el.classList.contains('editing')).to.equal(true)

      trigger(el, EDIT_TODO)

      expect(el.classList.contains('editing')).to.equal(false)
    })

    it('removes the element when the todo title is empty', done => {
      el.addEventListener(DESTROY_TODO, ({ detail: id }) => {
        expect(id).to.equal('foo')

        done()
      })

      trigger(el, EDIT_TODO, '')
    })

    it('triggers FINISH_EDIT_TODO button when the todo title is not empty', done => {
      el.addEventListener(FINISH_EDIT_TODO, ({ detail: { id, title } }) => {
        expect(id).to.equal('foo')
        expect(title).to.equal('ham egg')

        done()
      })

      trigger(el, EDIT_TODO, 'ham egg')
    })
  })
})
