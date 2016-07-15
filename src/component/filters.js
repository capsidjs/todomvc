const Filter = require('../domain/filter');

const {component} = $.cc;

/**
 * The todo filter controls.
 */
@component('filters')
class Filters {

	/**
	 * Sets the given filter button active.
	 * @param {Filter} filter The name of the filter
	 */
	setFilter(filter) {
		this.elem.find('a').removeClass('selected');

		if (filter === Filter.ACTIVE) {
			this.elem.find('a[name="active"]').addClass('selected');
		} else if (filter === Filter.COMPLETED) {
			this.elem.find('a[name="completed"]').addClass('selected');
		} else {
			this.elem.find('a[name="all"]').addClass('selected');
		}
	}
}

module.exports = Filters;
