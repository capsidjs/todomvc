import trigger from '../util/trigger';

const Const = require('../const');

const {on, component} = require('capsid');

/**
 * TodoInput class controls the input for adding todos.
 */
@component
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

		trigger(this.el, 'todo-new-item', title);
	}
}

module.exports = NewTodo;
