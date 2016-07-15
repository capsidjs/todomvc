const {expect} = require('chai');

const Todo = require('../../src/domain/todo');
const TodoFactory = require('../../src/domain/todo-factory');

describe('TodoFactory', () => {
	let factory;

	beforeEach(() => {
		factory = new TodoFactory();
	});

	describe('createFromObject', () => {
		it('creates a todo model from the object', () => {
			const todo = factory.createFromObject({
				id: 'foo',
				title: 'bar',
				completed: true
			});

			expect(todo).to.be.instanceof(Todo);
			expect(todo.id).to.equal('foo');
			expect(todo.title).to.equal('bar');
			expect(todo.completed).to.be.true;
		});
	});

	describe('createByTitle', () => {
		it('creates a todo from the given title', () => {
			const todo = factory.createByTitle('spam');

			expect(todo).to.be.instanceof(Todo);
			expect(todo.id).to.exist;
			expect(todo.title).to.equal('spam');
			expect(todo.completed).to.be.false;
		});
	});
});
