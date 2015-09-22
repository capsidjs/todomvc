/* global describe, it, expect, beforeEach */


var Todo = require('../../src/domain/todo');
var TodoCollection = require('../../src/domain/todo-collection');
var TodoRepository = require('../../src/domain/todo-repository');

var Const = require('../../src/const');

var todoRepository;


describe('TodoRepository', function () {
	'use strict';

	beforeEach(function () {

		todoRepository = new TodoRepository();

		todoRepository.saveAll(new TodoCollection([
			new Todo('a0', 'foo', true),
			new Todo('a1', 'bar', false),
			new Todo('a2', 'baz', true)
		]));

	});

	describe('saveAll', function () {

		it('saves the all of todos in the collection', function () {

			todoRepository.saveAll(new TodoCollection([
				new Todo('b0', 'foo', true),
				new Todo('b1', 'bar', false)
			]));

			var collection = todoRepository.getAll();

			expect(collection).to.be.instanceof(TodoCollection);
			expect(collection.toArray()).to.have.length(2);
			expect(collection.toArray()[0].id).to.equal('b0');
			expect(collection.toArray()[1].id).to.equal('b1');

		});

	});

	describe('getAll', function () {

		it('gets the all of saved todos', function () {

			var collection = todoRepository.getAll();

			expect(collection).to.be.instanceof(TodoCollection);
			expect(collection.toArray()).to.have.length(3);

		});

		it('gets an empty todo collection when nothing stored', function () {

			window.localStorage.clear();

			var collection = todoRepository.getAll();

			expect(collection).to.be.instanceof(TodoCollection);
			expect(collection.toArray()).to.have.length(0);

		});

		it('gets an empty todo collection when the stored json is broken', function () {

			window.localStorage[Const.STORAGE_KEY.TODO_LIST] = '[';

			var collection = todoRepository.getAll();

			expect(collection).to.be.instanceof(TodoCollection);
			expect(collection.toArray()).to.have.length(0);

		});

	});

});

