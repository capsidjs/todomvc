const { Filter } = require('../domain')
const {
  ACTION: { MODEL_UPDATE, CLEAR_COMPLETED }
} = require('../const')
const { on, emits, wired, component } = require('capsid')

@component('footer')
class Footer {
  @wired('.clear-completed')
  clearCompletedButton

  @wired('a[href="#/active"]')
  activeFilterButton

  @wired('a[href="#/completed"]')
  completedFilterButton

  @wired('a[href="#/"]')
  allFilterButton

  @wired('.todo-count')
  todoCountLabel

  @on('click', { at: '.clear-completed' })
  @emits(CLEAR_COMPLETED)
  clearCompletedTodos () {}

  @on(MODEL_UPDATE)
  onUpdate ({ detail: { todoCollection, filter } }) {
    const countLeft = todoCollection.uncompleted().length

    this.clearCompletedButton.style.display = todoCollection
      .completed()
      .isEmpty()
      ? 'none'
      : 'inline'

    this.activeFilterButton.classList.toggle(
      'selected',
      filter === Filter.ACTIVE
    )
    this.completedFilterButton.classList.toggle(
      'selected',
      filter === Filter.COMPLETED
    )
    this.allFilterButton.classList.toggle('selected', filter === Filter.ALL)

    this.todoCountLabel.innerHTML = `<strong>${countLeft} item${
      countLeft === 1 ? '' : 's'
    } left</strong>`

    this.el.style.display = todoCollection.isEmpty() ? 'none' : 'block'
  }
}

module.exports = Footer
