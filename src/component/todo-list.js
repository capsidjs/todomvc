const $ = require('jquery')

class TodoList {
  constructor (elem) {
    this.elem = elem
  }

  /**
   * Updates the todo items by the given todo model list.
   * @param {TodoCollection} todoList The todo list
   */
  update (todoList) {
    this.elem.empty()

    todoList.forEach(todo => {
      $('<li />').appendTo(this.elem).cc.init('todo-item').update(todo)
    })
  }
}

$.cc.assign('todo-list', TodoList)
