const { expect } = require('chai')
const { input } = require('dom-gen')

const Const = require('../../const')

let elem

describe('TodoInput', () => {
  beforeEach(() => {
    elem = input().val('abc')

    elem.cc.init('new-todo')
  })

  describe('on keypress', () => {
    it('does nothing when the keycode is not ENTER', () => {
      elem[0].dispatchEvent(new KeyboardEvent('keypress', {which: 32}))

      expect(elem.val()).to.equal('abc')
    })

    it('does nothing when the keycode is ENTER and the value is whitespace', () => {
      elem.val('   ')

      const e = new CustomEvent('keypress')
      e.which = Const.KEYCODE.ENTER

      elem[0].dispatchEvent(e)

      expect(elem.val()).to.equal('   ')
    })

    it('empties the value and triggers todo-new-item event', done => {
      elem.on('todo-new-item', e => {
        const title = e.detail

        expect(title).to.equal('abc')

        done()
      })

      const e = new CustomEvent('keypress')
      e.which = Const.KEYCODE.ENTER

      elem[0].dispatchEvent(e)
    })
  })
})
