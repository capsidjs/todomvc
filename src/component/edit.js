import trigger from '../util/trigger';

const {KEYCODE} = require('../const');

const {on, component} = $.cc;

/**
 * TodoEdit controls the edit area of each todo item.
 */
@component
class Edit {
	onStart() {
		this.$el.focus();
	}

	/**
	 * Updates the view with the given value.
	 */
	onUpdate(value) {
		this.$el.val(value);
		this.$el.data('prev-value', value);
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
		const value = this.$el.val();

		this.onUpdate(value);
		trigger(this.el, 'todo-edited', value);
	}

	/**
	 * Cancels editing and revert the change of the value.
	 */
	onCancel() {
		const value = this.$el.data('prev-value');

		this.onUpdate(value);
		trigger(this.el, 'todo-edited', value);
	}
}

module.exports = Edit;
