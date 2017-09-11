const { expect } = require('chai')
const { make } = require('capsid')
const Const = require('../../const')

let el

describe('TodoInput', () => {
  beforeEach(() => {
    el = document.createElement('input')
    el.value = 'abc'
    make('new-todo', el)
  })

  describe('on keypress', () => {
    it('does nothing when the keycode is not ENTER', () => {
      el.dispatchEvent(new KeyboardEvent('keypress', { which: 32 }))

      expect(el.value).to.equal('abc')
    })

    it('does nothing when the keycode is ENTER and the value is whitespace', () => {
      el.value = '   '

      const e = new CustomEvent('keypress')
      e.which = Const.KEYCODE.ENTER

      el.dispatchEvent(e)

      expect(el.value).to.equal('   ')
    })

    it('empties the value and triggers todo-new-item event', done => {
      el.addEventListener('todo-new-item', ({ detail: title }) => {
        expect(title).to.equal('abc')
        done()
      })

      const e = new CustomEvent('keypress')
      e.which = Const.KEYCODE.ENTER

      el.dispatchEvent(e)
    })
  })
})
