const Filter = require('../domain/filter');

const {
	component
} = $.cc;

/**
 * The observer of the filter and invokes filterchange event when it's changed.
 */
@component('filter-observer')
class FilterObserver {
	constructor() {
		$(window).on('hashchange', () => this.triggerFilterchange());

		setTimeout(() => this.triggerFilterchange(), 100);
	}

	/**
	 * Triggers the filterchange event.
	 */
	triggerFilterchange() {
		this.elem.trigger('filterchange', this.getCurrentFilter());
	}

	getCurrentFilter() {
		const name = window.location.hash.substring(1);

		if (name === Filter.ACTIVE.name) {
			return Filter.ACTIVE;
		} else if (name === Filter.COMPLETED.name) {
			return Filter.COMPLETED;
		}
		return Filter.ALL;
	}
}

module.exports = FilterObserver;
