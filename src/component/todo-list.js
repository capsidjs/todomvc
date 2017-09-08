const { li } = require('dom-gen')

const { component, get, make } = require('capsid')

/**
 * The todo list component.
 */
@component
class TodoList {
  /**
   * Updates the todo items by the given todo model list.
   * @param {TodoCollection} todos The todo list
   */
  onRefresh (todos, filter) {
    this.el.innerHTML = ''

    todos.filterBy(filter).forEach(todo => {
      const li = document.createElement('li')
      this.el.appendChild(li)
      make('todo-item', li).update(todo)
    })
  }

  /**
   * Toggles the given todos.
   * @param {TodoCollecion} todos The todo list
   */
  toggleAll (todos) {
    todos.forEach(todo => {
      get('todo-item', this.el.querySelector(`[id="${todo.id}"]`)).toggleCompleted()
    })
  }
}

module.exports = TodoList
