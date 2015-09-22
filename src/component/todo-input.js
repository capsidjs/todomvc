

var $ = require('jquery');
var Const = require('../const');



var TodoInput = $.cc.subclass(function (pt) {
	'use strict';

	pt.constructor = function (elem) {

		this.elem = elem;

		var self = this;


		this.elem.on('keypress', function (e) {

			self.onKeypress(e);

		});

	};

	pt.onKeypress = function (e) {

		if (e.which !== Const.KEYCODE.ENTER || !this.elem.val().trim()) {

			return;

		}

		var title = this.elem.val();
		this.elem.val('');

		this.elem.trigger('todo-new-item', title);

	};

});


$.cc.assign('todo-input', TodoInput);
