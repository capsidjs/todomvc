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
  constructor () {
    this.todoFactory = new TodoFactory()
    this.todoRepository = new TodoRepository()
    this.todoCollection = this.todoRepository.getAll()
  }

  @event('filterchange')
  onFilterchange (e, filter) {
    this.filter = filter

    this.updateView()
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
    this.save()

    this.updateView()
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
    this.elem.find('.todo-list').cc.get('todo-list').update(this.getDisplayCollection())
  }

  /**
   * Updates the filter buttons.
   * @private
   */
  updateFilterBtns () {
    this.elem.find('.todo-filters').cc.get('todo-filters').setFilter(this.filter.name)
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
    return this.todoCollection.filterBy(this.filter)
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
    this.save()

    if (!this.filter.isAll()) {
      this.updateTodoList()
    }

    this.updateControls()
  }

  /**
   * Removes the todo of the given id.
   * @param {object} e The event object
   * @param {String} id The todo id
   */
  @event('todo-item-destroy')
  remove (e, id) {
    this.todoCollection.removeById(id)
    this.save()

    this.updateView()
  }

  /**
   * Edits the todo item of the given id by the given title.
   * @param {object} e The event object
   * @param {string} id The todo id
   * @param {string} title The todo title
   */
  @event('todo-item-edited')
  editItem (e, id, title) {
    this.todoCollection.getById(id).title = title
    this.save()
  }

  /**
   * Clears the completed todos.
   */
  @event('todo-clear-completed')
  clearCompleted () {
    this.todoCollection = this.todoCollection.uncompleted()
    this.save()

    this.updateView()
  }

  /**
   * Uncompletes all the todo items.
   * @private
   */
  @event('todo-uncomplete-all')
  uncompleteAll () {
    if (this.filter.isAll()) {
      this.todoCollection.completed().forEach(todo => {
        this.elem.find('#' + todo.id).cc.get('todo-item').toggleCompleted()
      })
    } else {
      this.todoCollection.uncompleteAll()
      this.save()
      this.updateView()
    }
  }

  /**
   * Completes all the todo items.
   * @private
   */
  @event('todo-complete-all')
  completeAll () {
    if (this.filter.isAll()) {
      this.todoCollection.uncompleted().forEach(todo => {
        this.elem.find('#' + todo.id).cc.get('todo-item').toggleCompleted()
      })
    } else {
      this.todoCollection.completeAll()
      this.save()
      this.updateView()
    }
  }
}
