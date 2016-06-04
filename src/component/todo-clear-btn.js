const {component, event} = $.cc

void
@component('todo-clear-btn')
class {
  /**
   * Handles the click event. Triggers the todo-clear-completed event.
   */
  @event('click')
  onClick () {
    this.elem.trigger('todo-clear-completed')
  }
}
