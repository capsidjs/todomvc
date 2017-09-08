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
    if (todoCollection.length === this.el.querySelectorAll('.todo-item').length) {
      todoCollection.forEach(todo => {
        get('todo-item', this.el.querySelector(`[id="${todo.id}"`)).update(todo)
      })
    } else {
      this.el.innerHTML = ''

      todoCollection.filterBy(filter).forEach(todo => {
        const li = document.createElement('li')
        this.el.appendChild(li)
        make('todo-item', li).update(todo)
      })
    }
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
