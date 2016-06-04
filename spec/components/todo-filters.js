const {expect} = require('chai')
const {div, li} = require('dom-gen')

let filterControl
let elem

describe('TodoFilters', () => {
  beforeEach(() => {
    elem = div()
    filterControl = elem.cc.init('todo-filters')

    li('<a name="all" />').appendTo(elem)
    li('<a name="active" />').appendTo(elem)
    li('<a name="completed" />').appendTo(elem)
  })

  describe('setFilter', () => {
    it('sets the filter button for the given name active', () => {
      filterControl.setFilter('/all')

      expect(elem.find('a[name="all"]').hasClass('selected')).to.be.true
      expect(elem.find('a[name="active"]').hasClass('selected')).to.be.false
      expect(elem.find('a[name="completed"]').hasClass('selected')).to.be.false

      filterControl.setFilter('/active')

      expect(elem.find('a[name="all"]').hasClass('selected')).to.be.false
      expect(elem.find('a[name="active"]').hasClass('selected')).to.be.true
      expect(elem.find('a[name="completed"]').hasClass('selected')).to.be.false

      filterControl.setFilter('/completed')

      expect(elem.find('a[name="all"]').hasClass('selected')).to.be.false
      expect(elem.find('a[name="active"]').hasClass('selected')).to.be.false
      expect(elem.find('a[name="completed"]').hasClass('selected')).to.be.true

      filterControl.setFilter('/')

      expect(elem.find('a[name="all"]').hasClass('selected')).to.be.true
      expect(elem.find('a[name="active"]').hasClass('selected')).to.be.false
      expect(elem.find('a[name="completed"]').hasClass('selected')).to.be.false
    })
  })
})
