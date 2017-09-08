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

const { pub, make, on, component, wire } = require('capsid')

/**
 * The todo application class.
 */
@component
class Todoapp {
  __init__ () {
    this.todoFactory = new Todo.Factory()
    this.todoRepository = new Todo.Repository()
    this.todoCollection = this.todoRepository.getAll()

    const router = make('router', this.el)

    setTimeout(() => router.onHashchange())

    $(window).on('hashchange', () => router.onHashchange())
  }

  @wire get 'todo-list' () {}
  @wire get 'toggle-all' () {}

  @pub(MODEL_UPDATE, '.is-model-observer')
  refresh () {
    // updates visibility of main and footer area
    this.elem
      .find('.main, .footer')
      .css('display', this.todoCollection.isEmpty() ? 'none' : 'block')

    return this
  }

  @on(CHANGE_FILTER)
  onFilterchange (e) {
    this.filter = e.detail

    this.refresh()
  }

  /**
   * Adds new item by the given title.
   * @private
   * @param {Object} e The event object
   * @param {String} title The todo title
   */
  @on(NEW_ITEM)
  addTodo ({ detail: title }) {
    const todo = this.todoFactory.createByTitle(title)

    this.todoCollection.push(todo)
    this.save()

    this.refresh()
  }

  /**
   * Saves the current todo collection state.
   */
  save () {
    this.todoRepository.saveAll(this.todoCollection)
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

    this.refresh()
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

    this.refresh()
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

    this.refresh()
  }

  @on(TOGGLE_ALL)
  toggleAll ({ detail: toggle }) {
    if (toggle) {
      this.completeAll()
    } else {
      this.uncompleteAll()
    }
  }

  /**
   * Uncompletes all the todo items.
   * @private
   */
  uncompleteAll () {
    if (this.filter.isAll()) {
      this['todo-list'].toggleAll(this.todoCollection.completed())
    } else {
      this.todoCollection.uncompleteAll()
      this.save()

      this.refresh()
    }
  }

  /**
   * Completes all the todo items.
   * @private
   */
  completeAll () {
    if (this.filter.isAll()) {
      this['todo-list'].toggleAll(this.todoCollection.uncompleted())
    } else {
      this.todoCollection.completeAll()
      this.save()

      this.refresh()
    }
  }
}

module.exports = Todoapp
