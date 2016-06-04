const Const = require('../../src/const')

const $ = require('jquery')
const {expect} = require('chai')
const {input} = require('dom-gen')

let todoEdit

describe('TodoEdit', () => {
  beforeEach(() => {
    todoEdit = input().cc.init('todo-edit')
  })

  it('stops editing when the elem is blurred', done => {
    todoEdit.stopEditing = () => done()

    todoEdit.elem.trigger('blur')
  })

  describe('onKeypress', () => {
    it('stops editing when the pressed key is ENTER', done => {
      todoEdit.stopEditing = () => done()

      const e = $.Event('keypress')
      e.which = Const.KEYCODE.ENTER

      todoEdit.elem.trigger(e)
    })

    it('does nothing when the pressed key is not ENTER', done => {
      todoEdit.stopEditing = () => done(new Error('stopEditing should not be called'))

      const e = $.Event('keypress')
      e.which = 32

      todoEdit.elem.trigger(e)

      done()
    })
  })

  describe('stopEditing', () => {
    it('triggers todo-edited events with current value of the input', done => {
      todoEdit.elem.trigger = (event, value) => {
        expect(event).to.equal('todo-edited')
        expect(value).to.equal('foo')

        done()
      }

      todoEdit.elem.val('foo')

      todoEdit.stopEditing()
    })
  })
})
