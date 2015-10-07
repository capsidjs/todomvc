var $ = require('jquery');

var Const = require('../const');
var TodoFactory = require('../domain/todo-factory');
var TodoRepository = require('../domain/todo-repository');

/**
 * The todo application class.
 */
var TodoApp = $.cc.subclass(function (pt) {
	'use strict';

	pt.constructor = function (elem) {

		this.elem = elem;

		this.todoFactory = new TodoFactory();
		this.todoRepository = new TodoRepository();

		this.todoCollection = this.todoRepository.getAll();

		this.initEvents();

		this.updateView();

	};


	/**
	 * Initializes events.
	 *
	 * @private
	 */
	pt.initEvents = function () {

		var self = this;

		this.elem.on('todo-new-item', function (e, title) {

			self.addTodo(title);

		});

		this.elem.on('todo-item-toggle', function (e, id) {

			self.toggle(id);

		});

		this.elem.on('todo-item-destroy', function (e, id) {

			self.remove(id);

		});

		this.elem.on('todo-item-edited', function (e, id, title) {

			self.editItem(id, title);

		});

		this.elem.on('todo-clear-completed', function () {

			self.clearCompleted();

		});

		this.elem.on('todo-complete-all', function () {

			self.completeAll();

		});

		this.elem.on('todo-uncomplete-all', function () {

			self.uncompleteAll();

		});

		$(window).on('hashchange', function () {

			self.updateView();

		});

	};

	/**
	 * Adds new item by the given title.
	 *
	 * @private
	 * @param {String} title The todo title
	 */
	pt.addTodo = function (title) {

		var todo = this.todoFactory.createByTitle(title);

		this.todoCollection.push(todo);

		this.updateView();

		this.save();

	};

	/**
	 * Updates the view in the todo app.
	 *
	 * @private
	 */
	pt.updateView = function () {

		this.updateTodoList();

		this.updateControls();

	};

	/**
	 * Updates the controls.
	 *
	 * @private
	 */
	pt.updateControls = function () {

		this.updateFilterBtns();

		this.updateTodoCount();

		this.updateVisibility();

		this.updateToggleBtnState();

	};

	/**
	 * Updates the todo list.
	 *
	 * @private
	 */
	pt.updateTodoList = function () {

		var todoCollection = this.getDisplayCollection();

		this.elem.find('.todo-list').cc.get('todo-list').update(todoCollection);

	};

	/**
	 * Updates the filter buttons.
	 *
	 * @private
	 */
	pt.updateFilterBtns = function () {

		var filterName = this.getFilterNameFromHash();

		this.elem.find('.todo-filters').cc.get('todo-filters').setFilter(filterName);

	};

	/**
	 * Updates the todo counter.
	 *
	 * @private
	 */
	pt.updateTodoCount = function () {

		this.elem.find('.todo-count').cc.get('todo-count').setCount(this.todoCollection.uncompleted().toArray().length);

	};

	/**
	 * Updates the visiblity of components.
	 *
	 * @private
	 */
	pt.updateVisibility = function () {

		if (this.todoCollection.isEmpty()) {

			this.elem.find('#main, #footer').css('display', 'none');

		} else {

			this.elem.find('#main, #footer').css('display', 'block');

		}

	};

	/**
	 * Updates the toggle-all button state.
	 *
	 * @private
	 */
	pt.updateToggleBtnState = function () {

		console.log('updateToggleBtnState');

		this.elem.find('.todo-toggle-all').cc.get('todo-toggle-all').updateBtnState(
			!this.todoCollection.uncompleted().isEmpty()
		);

	};


	/**
	 * Gets the todo collection which is displayable in the current filter.
	 *
	 * @private
	 */
	pt.getDisplayCollection = function () {

		var filterName = this.getFilterNameFromHash();

		if (filterName === Const.FILTER.ACTIVE) {

			return this.todoCollection.uncompleted();

		}

		if (filterName === Const.FILTER.COMPLETED) {

			return this.todoCollection.completed();

		}

		return this.todoCollection;

	};

	/**
	 * Returns if the filter is enabled.
	 *
	 * @private
	 */
	pt.filterIsEnabled = function () {

		var filterName = this.getFilterNameFromHash();

		return filterName === Const.FILTER.ACTIVE || filterName === Const.FILTER.COMPLETED;

	};

	/**
	 * Gets the filter name from the hash string.
	 */
	pt.getFilterNameFromHash = function () {

		return window.location.hash.substring(1);

	};

	/**
	 * Saves the current todo collection state.
	 */
	pt.save = function () {

		this.todoRepository.saveAll(this.todoCollection);

	};

	/**
	 * Toggles the todo state of the given id.
	 *
	 * @param {String} id The todo id
	 */
	pt.toggle = function (id) {

		this.todoCollection.toggleById(id);

		if (this.filterIsEnabled()) {

			this.updateTodoList();

		}

		this.updateControls();

		this.save();

	};

	/**
	 * Removes the todo of the given id.
	 *
	 * @param {String} id The todo id
	 */
	pt.remove = function (id) {

		this.todoCollection.removeById(id);

		this.updateView();

		this.save();

	};

	/**
	 * Edits the todo item of the given id by the given title.
	 *
	 * @param {String} id The todo id
	 * @param {String} title The todo title
	 */
	pt.editItem = function (id, title) {

		var todo = this.todoCollection.getById(id);

		todo.body = title;

		this.save();

	};

	/**
	 * Clears the completed todos.
	 */
	pt.clearCompleted = function () {

		this.todoCollection = this.todoCollection.uncompleted();

		this.updateView();

		this.save();

	};

	/**
	 * Uncompletes all the todo items.
	 *
	 * @private
	 */
	pt.uncompleteAll = function () {

		if (this.filterIsEnabled()) {

			this.todoCollection.uncompleteAll();

			this.updateView();

			this.save();

		} else {

			this.todoCollection.completed().forEach(function (todo) {

				this.elem.find('#' + todo.id).cc.get('todo-item').toggleCompleted();

			}, this);

		}

	};

	/**
	 * Completes all the todo items.
	 *
	 * @private
	 */
	pt.completeAll = function () {

		if (this.filterIsEnabled()) {

			this.todoCollection.completeAll();

			this.updateView();

			this.save();

		} else {

			this.todoCollection.uncompleted().forEach(function (todo) {

				this.elem.find('#' + todo.id).cc.get('todo-item').toggleCompleted();

			}, this);

		}

	};

});


$.cc.assign('todo-app', TodoApp);
