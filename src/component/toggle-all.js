import trigger from '../util/trigger';

const {on, component} = require('capsid');

/**
 * The toggle all button.
 */
@component
class ToggleAll {
	/**
	 * Toggles the all items.
	 */
	@on('click')
	toggleAll() {
		if (this.elem.prop('checked')) {
			trigger(this.el, 'toggle-all-check');
		} else {
			trigger(this.el, 'toggle-all-uncheck');
		}
	}

	/**
	 * Updates the button state by the given active items' condition.
	 * @param {boolean} activeItemExists true if any active item exists, false otherwise
	 */
	updateBtnState(activeItemExists) {
		this.elem.prop('checked', !activeItemExists);
	}
}

module.exports = ToggleAll;
