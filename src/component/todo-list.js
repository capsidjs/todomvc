const {li} = require('dom-gen');

const {component} = $.cc;

/**
 * The todo list component.
 */
@component('todo-list')
class TodoList {
	/**
	 * Updates the todo items by the given todo model list.
	 * @param {TodoCollection} todoList The todo list
	 */
	update(todoList) {
		this.elem.empty();

		todoList.forEach(todo => {
			li().appendTo(this.elem).cc.init('todo-item').update(todo);
		});
	}
}

module.exports = TodoList;
