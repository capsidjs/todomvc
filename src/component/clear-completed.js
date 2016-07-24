const {component, on} = $.cc;

@component('clear-completed')
class ClearCompleted {
	/**
	 * Handles the click event. Triggers the todo-clear-completed event.
	 */
	@on('click')
	onClick() {
		this.elem.trigger('todo-clear-completed');
	}

	/**
	 * @param {TodoCollection} todos The todo collection
	 */
	onUpdate(todos) {
		this.elem.css('display', todos.completed().isEmpty() ? 'none' : 'inline');
	}
}

module.exports = ClearCompleted;
