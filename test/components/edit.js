const { expect } = require('chai')
const { input } = require('dom-gen')

const { trigger } = require('../helper')
const Const = require('../../src/const')

const { ACTION: { EDIT_TODO } } = Const

let elem
let todoEdit

describe('edit', () => {
  beforeEach(() => {
    elem = input()
    todoEdit = elem.cc.init('edit')
    todoEdit.onUpdate('foo')
  })

  describe('on blur', () => {
    it('triggers EDIT_TODO event when the elem is blurred', done => {
      elem.on(EDIT_TODO, () => done())

      trigger(elem, 'blur')
    })
  })

  describe('onKeypress', () => {
    it('triggers EDIT_TODO event with the edited value when ENTER is pressed', done => {
      elem.on(EDIT_TODO, e => {
        const value = e.detail

        expect(value).to.equal('bar')
        done()
      })

      elem.val('bar')

      const e = new CustomEvent('keypress')
      e.which = Const.KEYCODE.ENTER

      elem[0].dispatchEvent(e)
    })

    it('does nothing when the pressed key is SPACE', done => {
      elem.on(EDIT_TODO, () => done(new Error('todo-edited should not be triggered')))

      const e = new CustomEvent('keypress')
      e.which = 32

      todoEdit.el.dispatchEvent(e)

      done()
    })

    it('triggers EDIT_TODO event with the value before editing when ESCAPE is pressed', done => {
      elem.on(EDIT_TODO, e => {
        const value = e.detail

        expect(value).to.equal('foo')
        done()
      })

      elem.val('bar')

      const e = new CustomEvent('keypress')
      e.which = Const.KEYCODE.ESCAPE

      elem[0].dispatchEvent(e)
    })
  })

  describe('onFinish', () => {
    it('triggers EDIT_TODO events with current value of the input', done => {
      todoEdit.el.addEventListener(EDIT_TODO, e => {
        const value = e.detail

        expect(value).to.equal('foo')

        done()
      })

      todoEdit.elem.val('foo')

      todoEdit.onFinish()
    })
  })
})
