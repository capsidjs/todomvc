


var $ = require('jquery');

var TodoFilters = $.cc.subclass(function (pt) {
	'use strict';

	pt.constructor = function (elem) {

		this.elem = elem;

	};

	/**
	 * Sets the given filter button active.
	 *
	 * @param {String} name The name of the filter
	 */
	pt.setFilter = function (name) {

		this.elem.find('a').removeClass('selected');

		if (name === '/active') {

			this.elem.find('a[name="active"]').addClass('selected');

		} else if (name === '/completed') {

			this.elem.find('a[name="completed"]').addClass('selected');

		} else {

			this.elem.find('a[name="all"]').addClass('selected');

		}

	};

});

$.cc.assign('todo-filters', TodoFilters);
