const $ = require('jquery')

class TodoClearBtn {
  constructor (elem) {
    elem.on('click', () => {
      elem.trigger('todo-clear-completed')
    })
  }
}

$.cc('todo-clear-btn', TodoClearBtn)
