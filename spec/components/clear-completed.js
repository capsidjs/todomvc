const {button} = require('dom-gen')

describe('clear-completed', () => {
  it('triggers todo-clear-completed event when clicked', done => {
    button()
    .cc('clear-completed')
    .on('todo-clear-completed', () => done())
    .click()
  })
})
