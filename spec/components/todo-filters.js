const $ = require('jquery')
const {expect} = require('chai')

let filterControl
let elem

describe('TodoFilters', () => {
  beforeEach(() => {
    elem = $('<div />')
    filterControl = elem.cc.init('todo-filters')

    $('<li><a name="all" /></li>').appendTo(elem)
    $('<li><a name="active" /></li>').appendTo(elem)
    $('<li><a name="completed" /></li>').appendTo(elem)
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
