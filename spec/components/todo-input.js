var $ = require('jquery')
const {expect} = require('chai')

var Const = require('../../src/const')

var elem

describe('TodoInput', function () {
  'use strict'

  beforeEach(function () {
    elem = $('<input />').val('abc')

    elem.cc.init('todo-input')
  })

  describe('on keypress', function () {
    it('does nothing when the keycode is not ENTER', function () {
      elem.trigger($.Event('keypress', {which: 32}))

      expect(elem.val()).to.equal('abc')
    })

    it('does nothing when the keycode is ENTER and the value is whitespace', function () {
      elem.val('   ')

      elem.trigger($.Event('keypress', {which: Const.KEYCODE.ENTER}))

      expect(elem.val()).to.equal('   ')
    })

    it('empties the value and triggers todo-new-item event', function (done) {
      elem.on('todo-new-item', function (e, title) {
        expect(title).to.equal('abc')

        done()
      })

      elem.trigger($.Event('keypress', {which: Const.KEYCODE.ENTER}))
    })
  })
})
