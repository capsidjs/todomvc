const { expect } = require('chai')
const { make } = require('capsid')
const { trigger } = require('../../__tests__/helper')
const Const = require('../../const')

const {
  ACTION: { EDIT_TODO }
} = Const

let el
let todoEdit

describe('edit', () => {
  beforeEach(() => {
    el = document.createElement('input')
    todoEdit = make('edit', el)
    todoEdit.onUpdate('foo')
  })

  describe('on blur', () => {
    it('triggers EDIT_TODO event when the elem is blurred', done => {
      el.addEventListener(EDIT_TODO, () => done())

      trigger(el, 'blur')
    })
  })

  describe('onKeypress', () => {
    it('triggers EDIT_TODO event with the edited value when ENTER is pressed', done => {
      el.addEventListener(EDIT_TODO, ({ detail: value }) => {
        expect(value).to.equal('bar')
        done()
      })

      el.value = 'bar'

      const e = new CustomEvent('keypress')
      e.which = Const.KEYCODE.ENTER

      el.dispatchEvent(e)
    })

    it('does nothing when the pressed key is SPACE', done => {
      el.addEventListener(EDIT_TODO, () =>
        done(new Error('todo-edited should not be triggered'))
      )

      const e = new CustomEvent('keypress')
      e.which = 32

      el.dispatchEvent(e)

      done()
    })

    it('triggers EDIT_TODO event with the value before editing when ESCAPE is pressed', done => {
      el.addEventListener(EDIT_TODO, ({ detail: value }) => {
        expect(value).to.equal('foo')
        done()
      })

      el.value = 'bar'

      const e = new CustomEvent('keypress')
      e.which = Const.KEYCODE.ESCAPE

      el.dispatchEvent(e)
    })
  })

  describe('onFinish', () => {
    it('triggers EDIT_TODO events with current value of the input', done => {
      el.addEventListener(EDIT_TODO, ({ detail: value }) => {
        expect(value).to.equal('foo')
        done()
      })

      el.value = 'foo'

      todoEdit.onFinish()
    })
  })
})
