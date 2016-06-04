const {expect} = require('chai')
const {div} = require('dom-gen')

var elem
var toggleAll

describe('todo-toggle-all', function () {
  beforeEach(function () {
    elem = div()

    toggleAll = elem.cc.init('todo-toggle-all')
  })

  describe('on click', function () {
    it('toggles the state', function () {
      toggleAll.checked = true

      elem.trigger('click')

      setTimeout(function () {
        expect(toggleAll.checked).to.be.true

        elem.trigger('click')

        setTimeout(function () {
          expect(toggleAll.checked).to.be.true
        })
      })
    })

    it('triggers todo-uncomplete-all event when it is checked', function (done) {
      toggleAll.checked = true

      elem.on('todo-uncomplete-all', function () { done() })

      elem.trigger('click')
    })

    it('triggers todo-complete-all event when it is checked', function (done) {
      toggleAll.checked = false

      elem.on('todo-complete-all', function () { done() })

      elem.trigger('click')
    })
  })

  describe('updateBtnState', function () {
    it('sets the property checked false when active item does not exist', function () {
      toggleAll.updateBtnState(false)

      expect(elem.prop('checked')).to.be.true
    })

    it('sets the property checked false when active item does exist', function () {
      toggleAll.updateBtnState(true)

      expect(elem.prop('checked')).to.be.false
    })
  })
})
