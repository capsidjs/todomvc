const Const = require('../const');

const {
	on,
	component
} = $.cc;

/**
 * TodoInput class controls the input for adding todos.
 */
@component('new-todo')
class NewTodo {
	/**
	 * Handler for key presses.
	 * @param {Event}
	 */
	@on('keypress')
	onKeypress(e) {
		if (e.which !== Const.KEYCODE.ENTER) {
			return;
		}

		if (!this.elem.val() || !this.elem.val().trim()) {
			return;
		}

		const title = this.elem.val().trim();
		this.elem.val('');

		this.elem.trigger('todo-new-item', title);
	}
}

module.exports = NewTodo;
