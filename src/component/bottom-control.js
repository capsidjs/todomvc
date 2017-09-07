const { ACTION: { MODEL_UPDATE } } = require('../const')
const { on, emit, wire, component } = require('capsid')

@component('footer')
class BottomControl {
  @wire.el('.clear-completed') get clearCompletedButton () {}

  @on('click', { at: '.clear-completed' })
  @emit('todo-clear-completed')
  clearCompletedTodos () {}

  @on(MODEL_UPDATE)
  onUpdate (e) {
    const { detail: { todoCollection } } = e

    this.clearCompletedButton.style.display = todoCollection.completed().isEmpty() ? 'none' : 'inline'
  }
}

module.exports = BottomControl
