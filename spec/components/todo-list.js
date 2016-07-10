const {expect} = require('chai');
const {div} = require('dom-gen');

const TodoCollection = require('../../src/domain/todo-collection');
const TodoFactory = require('../../src/domain/todo-factory');

const todoFactory = new TodoFactory();

let todoList;

describe('todo-list', () => {
	beforeEach(() => {
		todoList = div().cc.init('todo-list');
	});

	describe('update', () => {
		it('updates the todo list view by the given todo array', () => {
			todoList.update(new TodoCollection([
				todoFactory.createByTitle('foo0'),
				todoFactory.createByTitle('foo1'),
				todoFactory.createByTitle('foo2')
			]));

			expect(todoList.elem.find('li')).to.have.length(3);
		});
	});
});
