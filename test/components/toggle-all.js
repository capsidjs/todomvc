const {expect} = require('chai')
const {input} = require('dom-gen')

var elem
var toggleAll

describe('toggle-all', () => {
  beforeEach(() => {
    elem = input({attr: {type: 'checkbox'}})

    toggleAll = elem.cc.init('toggle-all')

    elem.appendTo(document.body)
  })

  afterEach(() => {
    elem.remove()
  })

  describe('on click', () => {
    it('triggers toggle-all-uncheck event when it is checked', done => {
      elem.prop('checked', true)

      elem.on('toggle-all-uncheck', () => done())

      elem.trigger('click')
    })

    it('triggers toggle-all-check event when it is checked', done => {
      elem.prop('checked', false)

      elem.on('toggle-all-check', () => done())

      elem.trigger('click')
    })
  })

  describe('updateBtnState', () => {
    it('sets the property checked false when active item does not exist', () => {
      toggleAll.updateBtnState(false)

      expect(elem.prop('checked')).to.be.true()
    })

    it('sets the property checked false when active item does exist', () => {
      toggleAll.updateBtnState(true)

      expect(elem.prop('checked')).to.be.false()
    })
  })
})
