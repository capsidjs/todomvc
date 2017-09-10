const { ACTION: { MODEL_UPDATE } } = require('../const')
const { component, get, make, on } = require('capsid')

/**
 * The todo list component.
 */
@component
class TodoList {
  /**
   * Updates the todo items by the given todo model list.
   * @param {TodoCollection} todos The todo list
   */
  @on(MODEL_UPDATE)
  onRefresh ({ detail: { todoCollection, filter } }) {
    const visibleTodos = todoCollection.filterBy(filter)

    if (visibleTodos.length === this.el.querySelectorAll('.todo-item').length) {
      visibleTodos.forEach(todo => {
        get('todo-item', this.el.querySelector(`[id="${todo.id}"]`)).update(todo)
      })
    } else {
      this.el.innerHTML = ''

      visibleTodos.forEach(todo => {
        this.appendTodoItem(todo)
      })
    }
  }

  /**
   * Appends todo item by the todo model.
   * @param {Todo} todo The todo model
   */
  appendTodoItem (todo) {
    const li = document.createElement('li')
    this.el.appendChild(li)
    make('todo-item', li).update(todo)
  }
}

module.exports = TodoList
