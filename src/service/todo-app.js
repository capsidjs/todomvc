const Const = require('../const')
const TodoFactory = require('../domain/todo-factory')
const TodoRepository = require('../domain/todo-repository')

const {event, component} = $.cc

/**
 * The todo application class.
 */
void
@component('todo-app')
class {
  /**
   * @param {jQuery} elem The element
   */
  constructor (elem) {
    this.todoFactory = new TodoFactory()
    this.todoRepository = new TodoRepository()

    this.todoCollection = this.todoRepository.getAll()

    this.elem = elem

    this.initEvents()
    this.updateView()
  }

  /**
   * Initializes events.
   * @private
   */
  initEvents () {
    $(window).on('hashchange', () => {
      this.updateView()
    })
  }

  /**
   * Adds new item by the given title.
   * @private
   * @param {Object} e The event object
   * @param {String} title The todo title
   */
  @event('todo-new-item')
  addTodo (e, title) {
    const todo = this.todoFactory.createByTitle(title)

    this.todoCollection.push(todo)

    this.updateView()

    this.save()
  }

  /**
   * Updates the view in the todo app.
   * @private
   */
  updateView () {
    this.updateTodoList()

    this.updateControls()
  }

  /**
   * Updates the controls.
   * @private
   */
  updateControls () {
    this.updateFilterBtns()

    this.updateTodoCount()

    this.updateVisibility()

    this.updateToggleBtnState()
  }

  /**
   * Updates the todo list.
   * @private
   */
  updateTodoList () {
    const todoCollection = this.getDisplayCollection()

    this.elem.find('.todo-list').cc.get('todo-list').update(todoCollection)
  }

  /**
   * Updates the filter buttons.
   * @private
   */
  updateFilterBtns () {
    const filterName = this.getFilterNameFromHash()

    this.elem.find('.todo-filters').cc.get('todo-filters').setFilter(filterName)
  }

  /**
   * Updates the todo counter.
   * @private
   */
  updateTodoCount () {
    this.elem.find('.todo-count').cc.get('todo-count').setCount(this.todoCollection.uncompleted().toArray().length)
  }

  /**
   * Updates the visiblity of components.
   * @private
   */
  updateVisibility () {
    if (this.todoCollection.isEmpty()) {
      this.elem.find('#main, #footer').css('display', 'none')
    } else {
      this.elem.find('#main, #footer').css('display', 'block')
    }
  }

  /**
   * Updates the toggle-all button state.
   * @private
   */
  updateToggleBtnState () {
    this.elem.find('.todo-toggle-all').cc.get('todo-toggle-all').updateBtnState(
      !this.todoCollection.uncompleted().isEmpty()
    )
  }

  /**
   * Gets the todo collection which is displayable in the current filter.
   * @private
   */
  getDisplayCollection () {
    const filterName = this.getFilterNameFromHash()

    if (filterName === Const.FILTER.ACTIVE) {
      return this.todoCollection.uncompleted()
    }

    if (filterName === Const.FILTER.COMPLETED) {
      return this.todoCollection.completed()
    }

    return this.todoCollection
  }

  /**
   * Returns if the filter is enabled.
   * @private
   */
  filterIsEnabled () {
    const filterName = this.getFilterNameFromHash()

    return filterName === Const.FILTER.ACTIVE || filterName === Const.FILTER.COMPLETED
  }

  /**
   * Gets the filter name from the hash string.
   */
  getFilterNameFromHash () {
    return window.location.hash.substring(1)
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
  @event('todo-item-toggle')
  toggle (e, id) {
    this.todoCollection.toggleById(id)

    if (this.filterIsEnabled()) {
      this.updateTodoList()
    }

    this.updateControls()

    this.save()
  }

  /**
   * Removes the todo of the given id.
   * @param {object} e The event object
   * @param {String} id The todo id
   */
  @event('todo-item-destroy')
  remove (e, id) {
    this.todoCollection.removeById(id)

    this.updateView()

    this.save()
  }

  /**
   * Edits the todo item of the given id by the given title.
   * @param {object} e The event object
   * @param {string} id The todo id
   * @param {string} title The todo title
   */
  @event('todo-item-edited')
  editItem (e, id, title) {
    const todo = this.todoCollection.getById(id)

    todo.body = title

    this.save()
  }

  /**
   * Clears the completed todos.
   */
  @event('todo-clear-completed')
  clearCompleted () {
    this.todoCollection = this.todoCollection.uncompleted()

    this.updateView()

    this.save()
  }

  /**
   * Uncompletes all the todo items.
   * @private
   */
  @event('todo-uncomplete-all')
  uncompleteAll () {
    if (this.filterIsEnabled()) {
      this.todoCollection.uncompleteAll()

      this.updateView()

      this.save()
    } else {
      this.todoCollection.completed().forEach(todo => {
        this.elem.find('#' + todo.id).cc.get('todo-item').toggleCompleted()
      })
    }
  }

  /**
   * Completes all the todo items.
   * @private
   */
  @event('todo-complete-all')
  completeAll () {
    if (this.filterIsEnabled()) {
      this.todoCollection.completeAll()

      this.updateView()

      this.save()
    } else {
      this.todoCollection.uncompleted().forEach(todo => {
        this.elem.find('#' + todo.id).cc.get('todo-item').toggleCompleted()
      })
    }
  }
}
