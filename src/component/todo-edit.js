

var $ = require('jquery');

var Const = require('../const');


/**
 * TodoEdit controls the edit area of each todo item.
 */
var TodoEdit = $.cc.subclass(function (pt) {
	'use strict';

	pt.constructor = function (elem) {

		this.elem = elem;

		this.initEvents();

	};


	/**
	 * Initializes the events
	 *
	 * @private
	 */
	pt.initEvents = function () {

		var self = this;

		this.elem.on('keypress', function (e) {

			self.onKeypress(e);

		});

		this.elem.on('blur', function () {

			self.stopEditing();

		});

	};

	/**
	 * Handler for the key press events.
	 *
	 * @param {Event} e The event
	 */
	pt.onKeypress = function (e) {

		if (e.which === Const.KEYCODE.ENTER) {

			this.stopEditing();

		}

	};

	/**
	 * Stops editing with current value.
	 */
	pt.stopEditing = function () {

		this.elem.trigger('todo-edited', this.elem.val());

	};

});

$.cc.assign('todo-edit', TodoEdit);
