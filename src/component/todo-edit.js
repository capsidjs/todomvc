const Const = require('../const');

const {
	on,
	component
} = $.cc;

/**
 * TodoEdit controls the edit area of each todo item.
 */
@component('todo-edit')
class TodoEdit {
	/**
	 * Handler for the key press events.
	 *
	 * @param {Event} e The event
	 */
	@on('keypress')
	onKeypress(e) {
		if (e.which === Const.KEYCODE.ENTER) {
			this.stopEditing();
		}
	}

	/**
	 * Stops editing with current value.
	 */
	@on('blur')
	stopEditing() {
		this.elem.trigger('todo-edited', this.elem.val());
	}
}

module.exports = TodoEdit;
