const {expect} = require('chai');
const {div, ul, button, footer} = require('dom-gen');

const Filter = require('../../src/domain/filter');

let elem;
let todoApp;

describe('todoapp', () => {
	beforeEach(() => {
		window.localStorage.clear();

		elem = div(
			div(
				{attr: {id: 'main'}},
				ul().cc('todo-list'),
				button().cc('toggle-all')
			),
			footer(
				{attr: {id: 'footer'}},
				ul().cc('filters'),
				div().cc('todo-count')
			)
		);

		todoApp = elem.cc.init('todoapp');

		elem.trigger('filterchange', Filter.ALL);
	});

	describe('on filterchange', () => {
		it('updates view', done => {
			elem.on('todo-app-update', () => done());

			elem.trigger('filterchange', Filter.ALL);
		});
	});

	describe('on todo-new-item', () => {
		it('adds the item of the given title', () => {
			elem.trigger('todo-new-item', 'foo');

			expect(todoApp.todoCollection.toArray()).to.have.length(1);
		});
	});

	describe('on todo-item-toggle', () => {
		it('toggles the item', () => {
			elem.trigger('todo-new-item', 'foo');

			const id = elem.find('.todo-item').attr('id');

			elem.trigger('todo-item-toggle', id);

			const todo = todoApp.todoCollection.getById(id);

			expect(todo.completed).to.be.true;
		});

		it('updates the todo list when the filter is not `/all`', done => {
			elem.trigger('todo-new-item', 'foo');
			elem.trigger('filterchange', Filter.ACTIVE);

			elem.on('todo-app-update.todo-list', () => done());

			const id = elem.find('.todo-item').attr('id');

			elem.trigger('todo-item-toggle', id);
		});
	});

	describe('on todo-item-destroy', () => {
		it('removes the item', () => {
			elem.trigger('todo-new-item', 'foo');
			elem.trigger('todo-new-item', 'bar');

			expect(todoApp.todoCollection.toArray().length).to.equal(2);

			let id = elem.find('.todo-item').attr('id');

			elem.trigger('todo-item-destroy', id);

			expect(todoApp.todoCollection.toArray().length).to.equal(1);

			id = elem.find('.todo-item').attr('id');

			elem.trigger('todo-item-destroy', id);

			expect(todoApp.todoCollection.toArray().length).to.equal(0);
		});
	});

	describe('on todo-item-edited', () => {
		it('saves the edited title', () => {
			elem.trigger('todo-new-item', 'foo');

			const id = elem.find('.todo-item').attr('id');

			elem.trigger('todo-item-edited', [id, 'foobar']);

			expect(todoApp.todoCollection.getById(id).title).to.equal('foobar');
		});
	});

	describe('on todo-clear-completed', () => {
		it('clears the completed todos', () => {
			elem.trigger('todo-new-item', 'foo');
			elem.trigger('todo-new-item', 'bar');

			let id = elem.find('.todo-item').attr('id');

			elem.trigger('todo-item-toggle', id);

			elem.trigger('todo-clear-completed');

			expect(todoApp.todoCollection.toArray().length).to.equal(1);

			id = elem.find('.todo-item').attr('id');

			const todo = todoApp.todoCollection.getById(id);

			expect(todo.title).to.equal('bar');
		});
	});

	describe('on todo-complete-all', () => {
		it('completes all the todos when the filter is `/all`', () => {
			elem.trigger('todo-new-item', 'foo');
			elem.trigger('todo-new-item', 'bar');

			elem.trigger('todo-complete-all');

			todoApp.todoCollection.toArray().forEach(todo => {
				expect(todo.completed).to.be.true;
			});
		});

		it('completes all the todos when the filter is not `/all`', () => {
			elem.trigger('filterchange', Filter.ACTIVE);

			elem.trigger('todo-new-item', 'foo');
			elem.trigger('todo-new-item', 'bar');

			elem.trigger('todo-complete-all');

			todoApp.todoCollection.toArray().forEach(todo => {
				expect(todo.completed).to.be.true;
			});
		});
	});

	describe('on todo-uncomplete-all', () => {
		it('uncompletes all the todos when the filter is `/all`', () => {
			elem.trigger('todo-new-item', 'foo');
			elem.trigger('todo-new-item', 'bar');

			elem.trigger('todo-complete-all');
			elem.trigger('todo-uncomplete-all');

			todoApp.todoCollection.toArray().forEach(todo => {
				expect(todo.completed).to.be.false;
			});
		});

		it('uncompletes all the todos when the filter is not `/all`', () => {
			elem.trigger('filterchange', Filter.ACTIVE);

			elem.trigger('todo-new-item', 'foo');
			elem.trigger('todo-new-item', 'bar');

			elem.trigger('todo-complete-all');
			elem.trigger('todo-uncomplete-all');

			todoApp.todoCollection.toArray().forEach(todo => {
				expect(todo.completed).to.be.false;
			});
		});
	});
});
