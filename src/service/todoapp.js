const { Todo } = require('../domain')

const { ACTION: {
  CHANGE_FILTER,
  CLEAR_COMPLETED,
  DESTROY_TODO,
  FINISH_EDIT_TODO,
  MODEL_UPDATE,
  NEW_ITEM,
  TOGGLE_ALL,
  TOGGLE_TODO
} } = require('../const')

const { notifies, make, on, component } = require('capsid')

/**
 * The todo application class.
 */
@component
class Todoapp {
  __mount__ () {
    this.todoFactory = new Todo.Factory()
    this.todoRepository = new Todo.Repository()
    this.todoCollection = this.todoRepository.getAll()

    const router = make('router', this.el)

    setTimeout(() => router.onHashchange())

    window.addEventListener('hashchange', () => router.onHashchange())
  }

  /**
   * Saves the current todo collection state.
   */
  @notifies(MODEL_UPDATE, '.is-model-observer')
  save () {
    this.todoRepository.saveAll(this.todoCollection)

    return this
  }

  @on(CHANGE_FILTER)
  onFilterchange ({ detail: filter }) {
    this.filter = filter
    this.save()
  }

  /**
   * Adds new item by the given title.
   * @private
   * @param {Object} e The event object
   * @param {String} title The todo title
   */
  @on(NEW_ITEM)
  addTodo ({ detail: title }) {
    this.todoCollection.push(this.todoFactory.createByTitle(title))
    this.save()
  }

  /**
   * Toggles the todo state of the given id.
   * @param {object} e The event object
   * @param {String} id The todo id
   */
  @on(TOGGLE_TODO)
  toggle ({ detail: id }) {
    this.todoCollection.toggleById(id)
    this.save()
  }

  /**
   * Removes the todo of the given id.
   * @param {object} e The event object
   * @param {String} id The todo id
   */
  @on(DESTROY_TODO)
  remove ({ detail: id }) {
    this.todoCollection.removeById(id)
    this.save()
  }

  /**
   * Edits the todo item of the given id by the given title.
   * @param {object} e The event object
   * @param {string} id The todo id
   * @param {string} title The todo title
   */
  @on(FINISH_EDIT_TODO)
  editItem ({ detail: { id, title } }) {
    this.todoCollection.getById(id).title = title
    this.save()
  }

  /**
   * Clears the completed todos.
   */
  @on(CLEAR_COMPLETED)
  clearCompleted () {
    this.todoCollection = this.todoCollection.uncompleted()
    this.save()
  }

  @on(TOGGLE_ALL)
  toggleAll ({ detail: toggle }) {
    if (toggle) {
      this.todoCollection.completeAll()
    } else {
      this.todoCollection.uncompleteAll()
    }

    this.save()
  }
}

module.exports = Todoapp
