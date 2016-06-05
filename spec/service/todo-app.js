const {expect} = require('chai')
const {div, ul, button, footer} = require('dom-gen')

let elem
let todoApp
let filterObserver

describe('todo-app', () => {
  beforeEach(() => {
    elem = div(
      div({attr: {id: 'main'}},
        ul().addClass('todo-list'),
        button().addClass('todo-toggle-all')
      ),
      footer({attr: {id: 'footer'}},
        ul().addClass('todo-filters'),
        div().addClass('todo-count')
      )
    )

    $.cc.init(null, elem)

    todoApp = elem.cc.init('todo-app')
    filterObserver = elem.cc.init('filter-observer')
    filterObserver.triggerFilterchange()
  })

  describe('on hashchange', () => {
    it('updates view', done => {
      todoApp.updateView = () => done()

      window.location.href = '#foo'
    })
  })

  describe('on todo-new-item', () => {
    it('adds the item of the given title', () => {
      elem.trigger('todo-new-item', 'foo')

      expect(todoApp.todoCollection.toArray()).to.have.length(1)
    })
  })

  describe('on todo-item-toggle', () => {})
  describe('on todo-item-destroy', () => {})
  describe('on todo-item-edited', () => {})
  describe('on todo-clear-completed', () => {})
  describe('on todo-complete-all', () => {})
  describe('on todo-uncomplete-all', () => {})
  describe('on window hashchange', () => {})
})
