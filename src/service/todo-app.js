const $ = require('jquery')

const Const = require('../const')
const TodoFactory = require('../domain/todo-factory')
const TodoRepository = require('../domain/todo-repository')

/**
 * The todo application class.
 */
class TodoApp {
  /**
   * @param {jQuery} elem The element
   */
  constructor (elem) {
    this.todoFactory = new TodoFactory()
    this.todoRepository = new TodoRepository()

    this.todoCollection = this.todoRepository.getAll()

    this.initEvents(elem)

    this.elem = elem

    this.updateView()
  }

  /**
   * Initializes events.
   * @private
   * @param {jQuery} elem The element
   */
  initEvents (elem) {
    elem.on('todo-new-item', (e, title) => {
      this.addTodo(title)
    })

    elem.on('todo-item-toggle', (e, id) => {
      this.toggle(id)
    })

    elem.on('todo-item-destroy', (e, id) => {
      this.remove(id)
    })

    elem.on('todo-item-edited', (e, id, title) => {
      this.editItem(id, title)
    })

    elem.on('todo-clear-completed', () => {
      this.clearCompleted()
    })

    elem.on('todo-complete-all', () => {
      this.completeAll()
    })

    elem.on('todo-uncomplete-all', () => {
      this.uncompleteAll()
    })

    $(window).on('hashchange', () => {
      this.updateView()
    })
  }

  /**
   * Adds new item by the given title.
   *
   * @private
   * @param {String} title The todo title
   */
  addTodo (title) {
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
   * @param {String} id The todo id
   */
  toggle (id) {
    this.todoCollection.toggleById(id)

    if (this.filterIsEnabled()) {
      this.updateTodoList()
    }

    this.updateControls()

    this.save()
  }

  /**
   * Removes the todo of the given id.
   * @param {String} id The todo id
   */
  remove (id) {
    this.todoCollection.removeById(id)

    this.updateView()

    this.save()
  }

  /**
   * Edits the todo item of the given id by the given title.
   * @param {String} id The todo id
   * @param {String} title The todo title
   */
  editItem (id, title) {
    const todo = this.todoCollection.getById(id)

    todo.body = title

    this.save()
  }

  /**
   * Clears the completed todos.
   */
  clearCompleted () {
    this.todoCollection = this.todoCollection.uncompleted()

    this.updateView()

    this.save()
  }

  /**
   * Uncompletes all the todo items.
   * @private
   */
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

$.cc.assign('todo-app', TodoApp)
