const Filter = require('../domain/filter');

const {component} = require('capsid');

/**
 * The todo filter controls.
 */
@component
class Filters {

	/**
	 * Sets the given filter button active.
	 * @param {Filter} filter The name of the filter
	 */
	setFilter(filter) {
		this.elem.find('a').removeClass('selected');

		if (filter === Filter.ACTIVE) {
			this.elem.find('a[href="#/active"]').addClass('selected');
		} else if (filter === Filter.COMPLETED) {
			this.elem.find('a[href="#/completed"]').addClass('selected');
		} else {
			this.elem.find('a[href="#/"]').addClass('selected');
		}
	}
}

module.exports = Filters;
