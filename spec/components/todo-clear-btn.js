const $ = require('jquery')

describe('TodoClearBtn', () => {
  it('triggers todo-clear-completed event when clicked', done => {
    const dom = $('<button />')

    dom.cc.init('todo-clear-btn')

    dom.on('todo-clear-completed', () => done())

    dom.click()
  })
})
