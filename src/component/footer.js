const { Filter } = require('../domain')
const { ACTION: { MODEL_UPDATE, CLEAR_COMPLETED } } = require('../const')
const { on, emit, wire, component } = require('capsid')

@component
class Footer {
  @wire.el('.clear-completed') get clearCompletedButton () {}

  @wire.el('a[href="#/active"]') get activeFilterButton () {}
  @wire.el('a[href="#/completed"]') get completedFilterButton () {}
  @wire.el('a[href="#/"]') get allFilterButton () {}

  @wire.el('.todo-count') get todoCountLabel () {}

  @on('click', { at: '.clear-completed' })
  @emit(CLEAR_COMPLETED)
  clearCompletedTodos () {}

  @on(MODEL_UPDATE)
  onUpdate ({ detail: { todoCollection, filter } }) {
    const countLeft = todoCollection.uncompleted().length

    this.clearCompletedButton.style.display = todoCollection.completed().isEmpty() ? 'none' : 'inline'

    this.activeFilterButton.classList.toggle('selected', filter === Filter.ACTIVE)
    this.completedFilterButton.classList.toggle('selected', filter === Filter.COMPLETED)
    this.allFilterButton.classList.toggle('selected', filter === Filter.ALL)

    this.todoCountLabel.innerHTML = `<strong>${countLeft} item${countLeft === 1 ? '' : 's'} left</strong>`

    this.el.style.display = todoCollection.isEmpty() ? 'none' : 'block'
  }
}

module.exports = Footer
