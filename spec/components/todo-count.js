/* global describe, it, expect */

var $ = require('jquery');


describe('TodoCount', function () {
	'use strict';

	describe('setCount', function () {

		it('sets label properly', function () {

			var dom = $('<span />');

			dom.cc.init('todo-count').setCount(0);

			expect(dom.html()).to.equal('<strong>0</strong> items left');

			dom.cc.init('todo-count').setCount(1);

			expect(dom.html()).to.equal('<strong>1</strong> item left');

			dom.cc.init('todo-count').setCount(2);

			expect(dom.html()).to.equal('<strong>2</strong> items left');

		});

	});

});
