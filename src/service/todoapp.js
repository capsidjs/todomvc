const TodoFactory = require('../domain/todo-factory');
const TodoRepository = require('../domain/todo-repository');
require('./todo-app-presenter');

const {on, emit, component} = $.cc;

/**
 * The todo application class.
 */
@component('todoapp')
class Todoapp {
	/**
	 * @param {jQuery} elem The element
	 */
	constructor(elem) {
		this.todoFactory = new TodoFactory();
		this.todoRepository = new TodoRepository();
		this.todoCollection = this.todoRepository.getAll();

		elem.cc('todo-app-presenter');

		const router = $(window).data('target', elem).cc('router');

		setTimeout(() => router.trigger('hashchange'));
	}

	@on('filterchange')
	@emit('todo-app-update').last
	onFilterchange(e, filter) {
		this.filter = filter;
	}

	/**
	 * Adds new item by the given title.
	 * @private
	 * @param {Object} e The event object
	 * @param {String} title The todo title
	 */
	@on('todo-new-item')
	@emit('todo-app-update').last
	addTodo(e, title) {
		const todo = this.todoFactory.createByTitle(title);

		this.todoCollection.push(todo);
		this.save();
	}

	/**
	 * Saves the current todo collection state.
	 */
	save() {
		this.todoRepository.saveAll(this.todoCollection);
	}

	/**
	 * Toggles the todo state of the given id.
	 * @param {object} e The event object
	 * @param {String} id The todo id
	 */
	@on('todo-item-toggle')
	@emit('todo-app-update.controls').last
	toggle(e, id) {
		this.todoCollection.toggleById(id);
		this.save();

		if (!this.filter.isAll()) {
			this.elem.trigger('todo-app-update.todo-list');
		}
	}

	/**
	 * Removes the todo of the given id.
	 * @param {object} e The event object
	 * @param {String} id The todo id
	 */
	@on('todo-item-destroy')
	@emit('todo-app-update').last
	remove(e, id) {
		this.todoCollection.removeById(id);
		this.save();
	}

	/**
	 * Edits the todo item of the given id by the given title.
	 * @param {object} e The event object
	 * @param {string} id The todo id
	 * @param {string} title The todo title
	 */
	@on('todo-item-edited')
	editItem(e, id, title) {
		this.todoCollection.getById(id).title = title;
		this.save();
	}

	/**
	 * Clears the completed todos.
	 */
	@on('todo-clear-completed')
	@emit('todo-app-update').last
	clearCompleted() {
		this.todoCollection = this.todoCollection.uncompleted();
		this.save();
	}

	/**
	 * Uncompletes all the todo items.
	 * @private
	 */
	@on('todo-uncomplete-all')
	uncompleteAll() {
		if (this.filter.isAll()) {
			this.todoCollection.completed().forEach(todo => {
				this.elem.find('#' + todo.id).cc.get('todo-item').toggleCompleted();
			});
		} else {
			this.todoCollection.uncompleteAll();
			this.save();

			this.elem.trigger('todo-app-update');
		}
	}

	/**
	 * Completes all the todo items.
	 * @private
	 */
	@on('todo-complete-all')
	completeAll() {
		if (this.filter.isAll()) {
			this.completeAllWhenFilterAll();
		} else {
			this.completeAllWhenFilterNotAll();
		}
	}

	/**
	 * Completes all the todo items when the filter is /all.
	 * @private
	 */
	completeAllWhenFilterAll() {
		this.todoCollection.uncompleted().forEach(todo => {
			this.elem.find('#' + todo.id).cc.get('todo-item').toggleCompleted();
		});
	}

	/**
	 * Completes all the todo items when the filter is not /all.
	 * @private
	 */
	@emit('todo-app-update').last
	completeAllWhenFilterNotAll() {
		this.todoCollection.completeAll();
		this.save();
	}
}

module.exports = Todoapp;
