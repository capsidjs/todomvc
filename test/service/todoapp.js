import {trigger} from '../helper';

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
				div().cc('todo-count'),
				ul().cc('filters'),
				button().cc('clear-completed')
			)
		);

		todoApp = elem.cc.init('todoapp');

		trigger(elem, 'filterchange', Filter.ALL);
	});

	describe('on filterchange', () => {
		it('updates view', done => {
			todoApp.refreshAll = () => done();

			trigger(elem, 'filterchange', Filter.ALL);
		});
	});

	describe('on todo-new-item', () => {
		it('adds the item of the given title', () => {
			trigger(elem, 'todo-new-item', 'foo');

			expect(todoApp.todoCollection.toArray()).to.have.length(1);
		});
	});

	describe('on todo-item-toggle', () => {
		it('toggles the item', () => {
			trigger(elem, 'todo-new-item', 'foo');

			const id = elem.find('.todo-item').attr('id');

			trigger(elem, 'todo-item-toggle', id);

			const todo = todoApp.todoCollection.getById(id);

			expect(todo.completed).to.be.true;
		});

		it('updates the todo list when the filter is not `/all`', done => {
			trigger(elem, 'todo-new-item', 'foo');
			trigger(elem, 'filterchange', Filter.ACTIVE);

			todoApp.refreshAll = () => done();

			const id = elem.find('.todo-item').attr('id');

			trigger(elem, 'todo-item-toggle', id);
		});
	});

	describe('on todo-item-destroy', () => {
		it('removes the item', () => {
			trigger(elem, 'todo-new-item', 'foo');
			trigger(elem, 'todo-new-item', 'bar');

			expect(todoApp.todoCollection.toArray().length).to.equal(2);

			let id = elem.find('.todo-item').attr('id');

			trigger(elem, 'todo-item-destroy', id);

			expect(todoApp.todoCollection.toArray().length).to.equal(1);

			id = elem.find('.todo-item').attr('id');

			trigger(elem, 'todo-item-destroy', id);

			expect(todoApp.todoCollection.toArray().length).to.equal(0);
		});
	});

	describe('on todo-item-edited', () => {
		it('saves the edited title', () => {
			trigger(elem, 'todo-new-item', 'foo');

			const id = elem.find('.todo-item').attr('id');

			trigger(elem, 'todo-item-edited', {id, title: 'foobar'});

			expect(todoApp.todoCollection.getById(id).title).to.equal('foobar');
		});
	});

	describe('on todo-clear-completed', () => {
		it('clears the completed todos', () => {
			trigger(elem, 'todo-new-item', 'foo');
			trigger(elem, 'todo-new-item', 'bar');

			let id = elem.find('.todo-item').attr('id');

			trigger(elem, 'todo-item-toggle', id);

			trigger(elem, 'todo-clear-completed');

			expect(todoApp.todoCollection.toArray().length).to.equal(1);

			id = elem.find('.todo-item').attr('id');

			const todo = todoApp.todoCollection.getById(id);

			expect(todo.title).to.equal('bar');
		});
	});

	describe('on toggle-all-check', () => {
		it('completes all the todos when the filter is `/all`', () => {
			trigger(elem, 'todo-new-item', 'foo');
			trigger(elem, 'todo-new-item', 'bar');

			trigger(elem, 'toggle-all-check');

			todoApp.todoCollection.toArray().forEach(todo => {
				expect(todo.completed).to.be.true;
			});
		});

		it('completes all the todos when the filter is not `/all`', () => {
			trigger(elem, 'filterchange', Filter.ACTIVE);

			trigger(elem, 'todo-new-item', 'foo');
			trigger(elem, 'todo-new-item', 'bar');

			trigger(elem, 'toggle-all-check');

			todoApp.todoCollection.toArray().forEach(todo => {
				expect(todo.completed).to.be.true;
			});
		});
	});

	describe('on toggle-all-uncheck', () => {
		it('uncompletes all the todos when the filter is `/all`', () => {
			trigger(elem, 'todo-new-item', 'foo');
			trigger(elem, 'todo-new-item', 'bar');

			trigger(elem, 'toggle-all-check');
			trigger(elem, 'toggle-all-uncheck');

			todoApp.todoCollection.toArray().forEach(todo => {
				expect(todo.completed).to.be.false;
			});
		});

		it('uncompletes all the todos when the filter is not `/all`', () => {
			trigger(elem, 'filterchange', Filter.ACTIVE);

			trigger(elem, 'todo-new-item', 'foo');
			trigger(elem, 'todo-new-item', 'bar');

			trigger(elem, 'toggle-all-check');
			trigger(elem, 'toggle-all-uncheck');

			todoApp.todoCollection.toArray().forEach(todo => {
				expect(todo.completed).to.be.false;
			});
		});
	});
});
