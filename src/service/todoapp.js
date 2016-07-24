const TodoFactory = require('../domain/todo-factory');
const TodoRepository = require('../domain/todo-repository');

const {on, component, wire} = $.cc;

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

		const router = $(window).data('target', elem).cc('router');

		setTimeout(() => router.trigger('hashchange'));
	}

	@wire get 'todo-list'() {}
	@wire get filters() {}
	@wire get 'clear-completed'() {}
	@wire get 'todo-count'() {}
	@wire get 'toggle-all'() {}

	refreshControls() {
		// updates filter buttons
		this.filters.setFilter(this.filter);

		// updates visibility of clear-completed area
		this['clear-completed'].onUpdate(this.todoCollection);

		// updates todo count
		this['todo-count'].setCount(this.todoCollection.uncompleted().length);

        // updates visibility of main and footer area
		this.elem.find('.main, .footer').css('display', this.todoCollection.isEmpty() ? 'none' : 'block');

        // updates toggle-all button state
		this['toggle-all'].updateBtnState(!this.todoCollection.uncompleted().isEmpty());
	}

	refreshAll() {
		this.refreshControls();

		this['todo-list'].onRefresh(this.todoCollection, this.filter);
	}

	@on('filterchange')
	onFilterchange(e, filter) {
		this.filter = filter;

		this.refreshAll();
	}

	/**
	 * Adds new item by the given title.
	 * @private
	 * @param {Object} e The event object
	 * @param {String} title The todo title
	 */
	@on('todo-new-item')
	addTodo(e, title) {
		const todo = this.todoFactory.createByTitle(title);

		this.todoCollection.push(todo);
		this.save();

		this.refreshAll();
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
	toggle(e, id) {
		this.todoCollection.toggleById(id);
		this.save();

		if (this.filter.isAll()) {
			this.refreshControls();
		} else {
			this.refreshAll();
		}
	}

	/**
	 * Removes the todo of the given id.
	 * @param {object} e The event object
	 * @param {String} id The todo id
	 */
	@on('todo-item-destroy')
	remove(e, id) {
		this.todoCollection.removeById(id);
		this.save();

		this.refreshAll();
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
	clearCompleted() {
		this.todoCollection = this.todoCollection.uncompleted();
		this.save();

		this.refreshAll();
	}

	/**
	 * Uncompletes all the todo items.
	 * @private
	 */
	@on('todo-uncomplete-all')
	uncompleteAll() {
		if (this.filter.isAll()) {
			this['todo-list'].toggleAll(this.todoCollection.completed());
		} else {
			this.todoCollection.uncompleteAll();
			this.save();

			this.refreshAll();
		}
	}

	/**
	 * Completes all the todo items.
	 * @private
	 */
	@on('todo-complete-all')
	completeAll() {
		if (this.filter.isAll()) {
			this['todo-list'].toggleAll(this.todoCollection.uncompleted());
		} else {
			this.todoCollection.completeAll();
			this.save();

			this.refreshAll();
		}
	}
}

module.exports = Todoapp;
