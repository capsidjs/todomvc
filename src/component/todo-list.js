const {li} = require('dom-gen');

const {component} = $.cc;

/**
 * The todo list component.
 */
@component
class TodoList {
	/**
	 * Updates the todo items by the given todo model list.
	 * @param {TodoCollection} todos The todo list
	 */
	onRefresh(todos, filter) {
		this.elem.empty();

		todos.filterBy(filter).forEach(todo => {
			li().appendTo(this.elem).cc.init('todo-item').update(todo);
		});
	}

	/**
	 * Toggles the given todos.
	 * @param {TodoCollecion} todos The todo list
	 */
	toggleAll(todos) {
		todos.forEach(todo => {
			this.elem.find('#' + todo.id).cc.get('todo-item').toggleCompleted();
		});
	}
}

module.exports = TodoList;
