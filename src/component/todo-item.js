const {div, input, label, button} = require('dom-gen')
const {event, component} = $.cc

/**
 * TodoItem class controls todo item in a list.
 */
void
@component('todo-item')
class {
  constructor (elem) {
    elem.append(
      div(
        input({attr: {type: 'checkbox'}}).addClass('toggle'),
        label(),
        button().addClass('destroy')
      ).addClass('view'),
      input().addClass('edit').cc('todo-edit')
    )
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
  @event('click', '.toggle')
  toggleCompleted () {
    this.elem.trigger('todo-item-toggle', this.elem.attr('id'))

    this.completed = !this.completed
    this.updateView()
  }

  /**
   * Destroys the item.
   * @private
   */
  @event('click', '.destroy')
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
  @event('dblclick', 'label')
  startEditing () {
    this.elem.addClass('editing')
  }

  /**
   * Stops editing.
   * @private
   */
  @event('todo-edited')
  stopEditing (e, title) {
    this.elem.removeClass('editing')

    if (!title) {
      this.destroy()

      return
    }

    this.elem.find('label').text(title)

    this.elem.trigger('todo-item-edited', [this.elem.attr('id'), title])
  }
}
