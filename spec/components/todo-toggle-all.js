const {expect} = require('chai')
const {div} = require('dom-gen')

var elem
var toggleAll

describe('todo-toggle-all', () => {
  beforeEach(() => {
    elem = div()

    toggleAll = elem.cc.init('todo-toggle-all')
  })

  afterEach(() => {
    elem.remove()
  })

  describe('on click', () => {
    it('toggles the state', done => {
      toggleAll.checked = true

      elem.trigger('click')

      setTimeout(() => {
        expect(toggleAll.checked).to.be.true

        elem.trigger('click')

        setTimeout(() => {
          expect(toggleAll.checked).to.be.true
          done()
        })
      })
    })

    it('triggers todo-uncomplete-all event when it is checked', done => {
      toggleAll.checked = true

      elem.on('todo-uncomplete-all', () => done())

      elem.trigger('click')
    })

    it('triggers todo-complete-all event when it is checked', done => {
      toggleAll.checked = false

      elem.on('todo-complete-all', () => done())

      elem.trigger('click')
    })
  })

  describe('updateBtnState', () => {
    it('sets the property checked false when active item does not exist', () => {
      toggleAll.updateBtnState(false)

      expect(elem.prop('checked')).to.be.true
    })

    it('sets the property checked false when active item does exist', () => {
      toggleAll.updateBtnState(true)

      expect(elem.prop('checked')).to.be.false
    })
  })
})
