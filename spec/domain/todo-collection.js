/* global describe, it, expect, beforeEach */
/* jshint expr: true */

var Todo = require('../../src/domain/todo');
var TodoCollection = require('../../src/domain/todo-collection');

var collection;
var todo0;
var todo1;
var todo2;

describe('TodoCollection', function () {
	'use strict';

	beforeEach(function () {

		todo0 = new Todo('a0', 'spam', true),
		todo1 = new Todo('a1', 'ham', false),
		todo2 = new Todo('a2', 'egg', true),

		collection = new TodoCollection([todo0, todo1, todo2]);

	});

	describe('constructor', function () {

		it('craete an empty contructor if the give array is null', function () {

			collection = new TodoCollection();

			expect(collection.isEmpty()).to.be.true;

		});

	});

	describe('getById', function () {

		it('gets the todo by the given id', function () {

			expect(collection.getById('a0')).to.equal(todo0);
			expect(collection.getById('a1')).to.equal(todo1);
			expect(collection.getById('a2')).to.equal(todo2);

		});

	});

	describe('toggleById', function () {

		it('toggles the completed state of the todo of the given id', function () {

			collection.toggleById('a0');

			expect(collection.getById('a0').completed).to.be.false;

		});

	});

	describe('forEach', function () {

		it('iterates calling the given func in the given context', function () {

			var a = '';

			var Ctx = function () {
			};

			Ctx.prototype.method = function (title) {

				a = a + title;

			};

			collection.forEach(function (todo) {

				this.method(todo.title);

			}, new Ctx());

			expect(a).to.equal('spamhamegg');

		});

	});

	describe('push', function () {

		it('pushes the given todo at the end of the collection', function () {

			collection.push(new Todo('a3', 'spam ham', false));

			expect(collection.toArray()).to.have.length(4);

		});

	});

	describe('remove', function () {

		it('removes the given todo', function () {

			collection.remove(todo0);

			expect(collection.toArray()).to.have.length(2);

		});

		it('throws when the given todo does not exist', function () {

			expect(function () {

				collection.remove(new Todo('a3', 'spam ham', false));

			}).to.throw(Error);

		});

	});

	describe('removeById', function () {

		it('removes the todo by the id', function () {

			collection.removeById('a0');

			expect(collection.toArray()).to.have.length(2);

		});

	});

	describe('completed', function () {

		it('returns the collection of the completed todos', function () {

			var completed = collection.completed();

			expect(completed).to.be.instanceof(TodoCollection);
			expect(completed.toArray()).to.have.length(2);
			expect(completed.toArray()[0].id).to.equal('a0');
			expect(completed.toArray()[1].id).to.equal('a2');

		});

	});

	describe('uncompleted', function () {

		it('returns the collection of the uncompleted todos', function () {

			var uncompleted = collection.uncompleted();

			expect(uncompleted).to.be.instanceof(TodoCollection);
			expect(uncompleted.toArray()).to.have.length(1);
			expect(uncompleted.toArray()[0].id).to.equal('a1');

		});

	});

	describe('toArray', function () {

		it('returns the array of the todos', function () {

			expect(collection.toArray()).to.be.an('array');
			expect(collection.toArray()).to.have.length(3);
			expect(collection.toArray()[0]).to.equal(todo0);
			expect(collection.toArray()[1]).to.equal(todo1);
			expect(collection.toArray()[2]).to.equal(todo2);

		});

	});

	describe('completeAll', function () {

		it('completes all the todos', function () {

			collection.completeAll();

			expect(collection.completed().toArray()).to.have.length(3);

		});

	});

	describe('uncompleteAll', function () {

		it('uncompletes all the todos', function () {

			collection.uncompleteAll();

			expect(collection.completed().toArray()).to.have.length(0);

		});
	});

});
