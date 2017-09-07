const { Filter } = require('../domain')
const { ACTION: { MODEL_UPDATE } } = require('../const')
const { on, emit, wire, component } = require('capsid')

@component('footer')
class BottomControl {
  @wire.el('.clear-completed') get clearCompletedButton () {}

  @wire.el('a[href="#/active"]') get activeFilterButton () {}
  @wire.el('a[href="#/completed"]') get completedFilterButton () {}
  @wire.el('a[href="#/"]') get allFilterButton () {}

  @on('click', { at: '.clear-completed' })
  @emit('todo-clear-completed')
  clearCompletedTodos () {}

  @on(MODEL_UPDATE)
  onUpdate (e) {
    const { detail: { todoCollection, filter } } = e

    this.clearCompletedButton.style.display = todoCollection.completed().isEmpty() ? 'none' : 'inline'

    this.activeFilterButton.classList.toggle('selected', filter === Filter.ACTIVE)
    this.completedFilterButton.classList.toggle('selected', filter === Filter.COMPLETED)
    this.allFilterButton.classList.toggle('selected', filter === Filter.ALL)
  }
}

module.exports = BottomControl
