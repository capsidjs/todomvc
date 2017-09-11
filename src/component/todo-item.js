const { ACTION: {
  EDIT_TODO,
  TOGGLE_TODO,
  DESTROY_TODO,
  FINISH_EDIT_TODO
} } = require('../const')

const { on, emits, prep, wire, component } = require('capsid')

/**
 * TodoItem class controls todo item in a list.
 */
@component
class TodoItem {
  @wire.el('label') get label () {}
  @wire.el('.toggle') get toggle () {}
  @wire get edit () {}

  __init__ () {
    this.el.innerHTML = `
      <div class="view">
        <input type="checkbox" class="toggle"/>
        <label></label>
        <button class="destroy"></button>
      </div>
      <input class="edit" />
    `

    prep('edit', this.el)
  }

  /**
   * Updates the todo title by todo model.
   * @param {Todo} todo The todo
   * @param {String} todo.id The id
   * @param {String} todo.title The title
   * @param {Boolean} todo.completed If completed or not
   */
  update (todo) {
    this.el.setAttribute('id', todo.id)
    this.label.textContent = todo.title
    this.edit.onUpdate(todo.title)

    this.toggle.checked = todo.completed
    this.el.classList.toggle('completed', todo.completed)
  }

  /**
   * Toggles the completed state of the item.
   * @private
   */
  @on('click', { at: '.toggle' })
  @emits(TOGGLE_TODO)
  toggleCompleted () {
    return this.el.getAttribute('id')
  }

  /**
   * Destroys the item.
   * @private
   */
  @on('click', { at: '.destroy' })
  @emits(DESTROY_TODO)
  destroy () {
    return this.el.getAttribute('id')
  }

  /**
   * Starts editing.
   * @private
   */
  @on('dblclick', { at: 'label' })
  startEditing () {
    this.el.classList.add('editing')
    this.edit.onStart()
  }

  /**
   * Stops editing.
   * @private
   */
  @on(EDIT_TODO)
  stopEditing ({ detail: title }) {
    this.el.classList.remove('editing')

    if (!title) {
      this.destroy()

      return
    }

    this.finishEditTodo(title)
  }

  @emits(FINISH_EDIT_TODO)
  finishEditTodo (title) {
    return {
      title,
      id: this.el.getAttribute('id')
    }
  }
}

module.exports = TodoItem
