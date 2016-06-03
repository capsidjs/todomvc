/* globals describe, it, expect, beforeEach */
/* jshint expr: true */

var $ = require('jquery')

var filterControl
var elem

describe('TodoFilters', function () {
  'use strict'

  beforeEach(function () {
    elem = $('<div />')
    filterControl = elem.cc.init('todo-filters')

    $('<li><a name="all" /></li>').appendTo(elem)
    $('<li><a name="active" /></li>').appendTo(elem)
    $('<li><a name="completed" /></li>').appendTo(elem)
  })

  describe('setFilter', function () {
    it('sets the filter button for the given name active', function () {
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
