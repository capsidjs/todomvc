import trigger from '../util/trigger';

const {component, on} = $.cc;

@component
class ClearCompleted {
	/**
	 * Handles the click event. Triggers the todo-clear-completed event.
	 */
	@on('click')
	onClick() {
		trigger(this.el, 'todo-clear-completed');
	}

	/**
	 * @param {TodoCollection} todos The todo collection
	 */
	onUpdate(todos) {
		this.$el.css('display', todos.completed().isEmpty() ? 'none' : 'inline');
	}
}

module.exports = ClearCompleted;
