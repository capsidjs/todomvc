class Filter {
	/**
	 * @return {boolean}
	 */
	isAll() {
		return false;
	}
}

class AllFilter extends Filter {
	isAll() {
		return true;
	}
}

Filter.ALL = new AllFilter();
Filter.ACTIVE = new Filter();
Filter.COMPLETED = new Filter();

module.exports = Filter;
