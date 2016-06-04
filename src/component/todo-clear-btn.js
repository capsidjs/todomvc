const $ = require('jquery')

class TodoClearBtn {
  constructor (elem) {
    elem.on('click', () => {
      elem.trigger('todo-clear-completed')
    })
  }
}

$.cc.assign('todo-clear-btn', TodoClearBtn)
