const {
  ACTION: { TOGGLE_ALL, MODEL_UPDATE }
} = require('../const')
const { component, wired, emits, on } = require('capsid')

@component('main')
class Main {
  @wired('.toggle-all')
  toggleAllButton

  @on('click', { at: '.toggle-all' })
  @emits(TOGGLE_ALL)
  toggleAll () {
    return this.toggleAllButton.checked
  }

  @on(MODEL_UPDATE)
  onUpdate ({ detail: { todoCollection } }) {
    this.toggleAllButton.checked = todoCollection.uncompleted().isEmpty()

    this.el.style.display = todoCollection.isEmpty() ? 'none' : 'block'
  }
}

module.exports = Main
