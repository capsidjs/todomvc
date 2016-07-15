const {KEYCODE} = require('../const');

const {on, component} = $.cc;

/**
 * TodoEdit controls the edit area of each todo item.
 */
@component('edit')
class TodoEdit {
	onStart() {
		this.elem.focus();
	}

	/**
	 * Updates the view with the given value.
	 */
	onUpdate(value) {
		this.elem.val(value);
		this.elem.data('prev-value', value);
	}

	/**
	 * Handler for the key press events.
	 *
	 * @param {Event} e The event
	 */
	@on('keypress')
	@on('keydown')
	onKeypress(e) {
		if (e.which === KEYCODE.ENTER) {
			this.onFinish();
		} else if (e.which === KEYCODE.ESCAPE) {
			this.onCancel();
		}
	}

	/**
	 * Finishes editing with current value.
	 */
	@on('blur')
	onFinish() {
		const value = this.elem.val();

		this.onUpdate(value)
		this.elem.trigger('todo-edited', value);
	}

	/**
	 * Cancels editing and revert the change of the value.
	 */
	onCancel() {
		const value = this.elem.data('prev-value');

		this.onUpdate(value)
		this.elem.trigger('todo-edited', value);
	}
}

module.exports = TodoEdit;
