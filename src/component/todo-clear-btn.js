

var $ = require('jquery');

$.cc.register('todo-clear-btn', function (elem) {
	'use strict';

	elem.on('click', function () {

		elem.trigger('todo-clear-completed');

	});

});
