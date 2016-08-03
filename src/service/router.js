const {route, dispatch} = require('hash-route');

const Filter = require('../domain/filter');

const {component, on} = $.cc;

/**
 * The observer of the filter and invokes filterchange event when it's changed.
 */
@component('router')
class FilterObserver {
	constructor(elem) {
		this.target = elem.data('target');
	}

	@on('hashchange')
	onHashchange() {
		dispatch(this);
	}

	@route '#/all'() {
		this.target.trigger('filterchange', Filter.ALL);
	}

	@route '#/active'() {
		this.target.trigger('filterchange', Filter.ACTIVE);
	}

	@route '#/completed'() {
		this.target.trigger('filterchange', Filter.COMPLETED);
	}

	@route '*'() {
		this.target.trigger('filterchange', Filter.ALL);
	}
}

module.exports = FilterObserver;
