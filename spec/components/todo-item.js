/* globals describe, it, expect, beforeEach */
/* jshint expr: true */

var $ = require('jquery');
var todoItem;
var elem;
var parentElem;

describe('todo-edit', function () {
	'use strict';

	beforeEach(function () {

		parentElem = $('<ul />');

		elem = $('<li />').appendTo(parentElem);

		todoItem = elem.cc.init('todo-item');

		todoItem.update({id: 'foo', title: 'bar', completed: false});

	});

	it('initializes its content html', function () {

		expect(elem.find('.view')).to.have.length(1);
		expect(elem.find('.view input.toggle[type="checkbox"]')).to.have.length(1);
		expect(elem.find('.view label')).to.have.length(1);
		expect(elem.find('.view button.destroy')).to.have.length(1);
		expect(elem.find('input.edit')).to.have.length(1);

	});

	describe('update', function () {

		it('updates the content by the given todo object', function () {

			expect(elem.attr('id')).to.equal('foo');
			expect(elem.find('label').text()).to.equal('bar');
			expect(elem.find('.edit').val()).to.equal('bar');
			expect(elem.hasClass('completed')).to.be.false;
			expect(elem.find('.toggle').prop('checked')).to.be.false;

			todoItem.update({id: 'foo1', title: 'bar1', completed: true});

			expect(elem.attr('id')).to.equal('foo1');
			expect(elem.find('label').text()).to.equal('bar1');
			expect(elem.find('.edit').val()).to.equal('bar1');
			expect(elem.hasClass('completed')).to.be.true;
			expect(elem.find('.toggle').prop('checked')).to.be.true;

		});

	});

	describe('on .toggle click', function () {

		it('toggles the state of the todo', function () {

			elem.find('.toggle').trigger('click');

			expect(elem.hasClass('completed')).to.be.true;
			expect(elem.find('.toggle').prop('checked')).to.be.true;

			elem.find('.toggle').trigger('click');

			expect(elem.hasClass('completed')).to.be.false;
			expect(elem.find('.toggle').prop('checked')).to.be.false;

		});

	});

	describe('on .destroy click', function () {

		it('removes the element', function () {

			expect(elem.parent()).to.have.length(1);

			elem.find('.destroy').trigger('click');

			expect(elem.parent()).to.have.length(0);

		});

		it('triggers the todo-item-destroy event on the parent element', function (done) {

			parentElem.on('todo-item-destroy', function (e, id) {

				expect(id).to.equal('foo');

				done();

			});

			elem.find('.destroy').trigger('click');

		});

	});

	describe('on label dblclick', function () {

		it('adds editing class to the element', function () {

			elem.find('label').trigger('dblclick');

			expect(elem.hasClass('editing')).to.be.true;

		});

	});

	describe('on todo-edited event', function () {

		it('removes editing class', function () {

			elem.find('label').trigger('dblclick');

			expect(elem.hasClass('editing')).to.be.true;

			elem.trigger('todo-edited');

			expect(elem.hasClass('editing')).to.be.false;

		});

		it('removes the element when the todo title is empty', function () {

			elem.trigger('todo-edited', '');

			expect(elem.parent()).to.have.length(0);

		});

		it('updates label when the todo title is not empty', function () {

			elem.trigger('todo-edited', 'ham egg');

			expect(elem.find('label').text()).to.equal('ham egg');

		});

		it('triggers todo-item-edited button when the todo title is not empty', function (done) {

			elem.on('todo-item-edited', function (e, id, title) {

				expect(id).to.equal('foo');
				expect(title).to.equal('ham egg');

				done();

			});

			elem.trigger('todo-edited', 'ham egg');

		});

	});

});
