const $ = require('jquery')
const {div, input, label, button} = require('dom-gen')

/**
 * TodoItem class controls todo item in a list.
 */
class TodoItem {
  constructor (elem) {
    this.elem = elem

    this.initElems()
    this.initEvents()
  }

  /**
   * Inits elements
   *
   * @private
   */
  initElems () {
    this.elem.append(
      div(
        input({attr: {type: 'checkbox'}}).addClass('toggle'),
        label(),
        button().addClass('destroy')
      ).addClass('view'),
      input().addClass('edit').cc('todo-edit')
    )
  }

  /**
   * Inits events.
   * @private
   */
  initEvents () {
    this.elem.find('.toggle').on('click', () => {
      this.toggleCompleted()
    })

    this.elem.find('.destroy').on('click', () => {
      this.destroy()
    })

    this.elem.find('label').on('dblclick', () => {
      this.startEditing()
    })

    this.elem.on('todo-edited', (e, title) => {
      this.stopEditing(title)
    })
  }

  /**
   * Updates the todo title by todo model
   *
   * @param {Object} todo The todo
   * @param {String} todo.id The id
   * @param {String} todo.title The title
   * @param {Boolean} todo.completed If completed or not
   */
  update (todo) {
    this.elem.attr('id', todo.id)
    this.elem.find('label').text(todo.title)
    this.elem.find('.edit').val(todo.title)

    this.completed = todo.completed
    this.updateView()
  }

  /**
   * Toggles the completed state of the item.
   * @private
   */
  toggleCompleted () {
    this.elem.trigger('todo-item-toggle', this.elem.attr('id'))

    this.completed = !this.completed
    this.updateView()
  }

  /**
   * Destroys the item.
   * @private
   */
  destroy () {
    this.elem.parent().trigger('todo-item-destroy', this.elem.attr('id'))

    this.elem.remove()
  }

  /**
   * Updates the view state according to the current completed state.
   * @private
   */
  updateView () {
    if (this.completed) {
      this.complete()
    } else {
      this.uncomplete()
    }
  }

  /**
   * Completes the item state.
   * @private
   */
  complete () {
    this.elem.find('.toggle').prop('checked', true)
    this.elem.addClass('completed')
  }

  /**
   * Uncompletes the item state.
   * @private
   */
  uncomplete () {
    this.elem.find('.toggle').prop('checked', false)
    this.elem.removeClass('completed')
  }

  /**
   * Starts editing.
   * @private
   */
  startEditing () {
    this.elem.addClass('editing')
  }

  /**
   * Stops editing.
   * @private
   */
  stopEditing (title) {
    this.elem.removeClass('editing')

    if (!title) {
      this.destroy()

      return
    }

    this.elem.find('label').text(title)

    this.elem.trigger('todo-item-edited', [this.elem.attr('id'), title])
  }
}

$.cc('todo-item', TodoItem)
