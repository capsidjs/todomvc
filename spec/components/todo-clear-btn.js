const $ = require('jquery')
const {button} = require('dom-gen')

describe('TodoClearBtn', () => {
  it('triggers todo-clear-completed event when clicked', done => {
    button()
    .cc('todo-clear-btn')
    .on('todo-clear-completed', () => done())
    .click()
  })
})
