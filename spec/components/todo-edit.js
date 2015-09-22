/* global describe, it, expect, beforeEach */

var $ = require('jquery');

var Const = require('../../src/const');

var todoEdit;

describe('TodoEdit', function () {
	'use strict';

	beforeEach(function () {

		todoEdit = $('<input />').cc.init('todo-edit');

	});

	it('stops editing when the elem is blurred', function (done) {

		todoEdit.stopEditing = function () {
			done();
		};

		todoEdit.elem.trigger('blur');

	});

	describe('onKeypress', function () {

		it('stops editing when the pressed key is ENTER', function (done) {

			todoEdit.stopEditing = function () {
				done();
			};

			var e = $.Event('keypress');
			e.which = Const.KEYCODE.ENTER;

			todoEdit.elem.trigger(e);

		});

		it('does nothing when the pressed key is not ENTER', function (done) {

			todoEdit.stopEditing = function () {
				done(new Error('stopEditing should not be called'));
			};

			var e = $.Event('keypress');
			e.which = 32;

			todoEdit.elem.trigger(e);

			done();

		});

	});

	describe('stopEditing', function () {

		it('triggers todo-edited events with current value of the input', function (done) {

			todoEdit.elem.trigger = function (event, value) {

				expect(event).to.equal('todo-edited');
				expect(value).to.equal('foo');

				done();

			};

			todoEdit.elem.val('foo');

			todoEdit.stopEditing();

		});

	});

});
