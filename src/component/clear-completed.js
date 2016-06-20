const {component, on} = $.cc

void
@component('clear-completed')
class {
  /**
   * Handles the click event. Triggers the todo-clear-completed event.
   */
  @on('click')
  onClick () {
    this.elem.trigger('todo-clear-completed')
  }
}
