import trigger from '../util/trigger';

const {route, dispatch} = require('hash-route');

const Filter = require('../domain/filter');

const {component} = $.cc;

/**
 * The observer of the filter and invokes filterchange event when it's changed.
 */
@component
class Router {
	onHashchange() {
		dispatch(this);
	}

	@route '#/all'() {
		trigger(this.el, 'filterchange', Filter.ALL);
	}

	@route '#/active'() {
		trigger(this.el, 'filterchange', Filter.ACTIVE);
	}

	@route '#/completed'() {
		trigger(this.el, 'filterchange', Filter.COMPLETED);
	}

	@route '*'() {
		trigger(this.el, 'filterchange', Filter.ALL);
	}
}

module.exports = Router;
