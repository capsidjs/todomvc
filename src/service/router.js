const Filter = require('../domain/filter');
const {route, dispatch} = require('hash-route')

const {component, on} = $.cc;

/**
 * The observer of the filter and invokes filterchange event when it's changed.
 */
@component('router')
class FilterObserver {
	constructor(elem) {
		this.target = elem.data('target')
	}

	@on('hashchange')
	onHashchange () {
		dispatch(this)
	}

	@route('#/all') all() {
		this.target.trigger('filterchange', Filter.ALL)
	}

	@route('#/active') active() {
		this.target.trigger('filterchange', Filter.ACTIVE)
	}

	@route('#/completed') completed() {
		this.target.trigger('filterchange', Filter.COMPLETED)
	}

	@route('*') other() {
		this.target.trigger('filterchange', Filter.ALL)
	}
}

module.exports = FilterObserver;
