var $ = require('jquery');

var TodoCount = $.cc.subclass(function (pt) {
	'use strict';

	pt.constructor = function (elem) {

		this.elem = elem;

	};

	pt.setCount = function (count) {

		this.elem.empty();

		if (count === 1) {

			this.elem.text(' item left');

		} else {

			this.elem.text(' items left');

		}

		$('<strong />').text(count).prependTo(this.elem);

	};

});

$.cc.assign('todo-count', TodoCount);
