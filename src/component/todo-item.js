var $ = require('jquery');

/**
 * TodoItem class controls todo item in a list.
 */
var TodoItem = $.cc.subclass(function (pt) {
	'use strict';

	pt.constructor = function (elem) {

		this.elem = elem;

		this.initElems();
		this.initEvents();

	};

	/**
	 * Inits elements
	 *
	 * @private
	 */
	pt.initElems = function () {

		var view = $('<div class="view" />').appendTo(this.elem);

		$('<input class="toggle" type="checkbox" />').appendTo(view);
		$('<label />').appendTo(view);
		$('<button class="destroy" />').appendTo(view);
		$('<input class="edit" />').appendTo(this.elem).cc.init('todo-edit');

	};

	/**
	 * Inits events.
	 *
	 * @private
	 */
	pt.initEvents = function () {

		var self = this;

		this.elem.find('.toggle').on('click', function () {

			self.toggleCompleted();

		});

		this.elem.find('.destroy').on('click', function () {

			self.destroy();

		});

		this.elem.find('label').on('dblclick', function () {

			self.startEditing();

		});

		this.elem.on('todo-edited', function (e, title) {

			self.stopEditing(title);

		});

	};

	/**
	 * Updates the todo title by todo model
	 *
	 * @param {Object} todo The todo
	 * @param {String} todo.id The id
	 * @param {String} todo.title The title
	 * @param {Boolean} todo.completed If completed or not
	 */
	pt.update = function (todo) {

		this.elem.attr('id', todo.id);
		this.elem.find('label').text(todo.title);
		this.elem.find('.edit').val(todo.title);

		this.completed = todo.completed;
		this.updateView();

	};

	/**
	 * Toggles the completed state of the item.
	 *
	 * @private
	 */
	pt.toggleCompleted = function () {

		this.elem.trigger('todo-item-toggle', this.elem.attr('id'));

		this.completed = !this.completed;
		this.updateView();

	};

	/**
	 * Destroys the item.
	 *
	 * @private
	 */
	pt.destroy = function () {

		this.elem.parent().trigger('todo-item-destroy', this.elem.attr('id'));

		this.elem.remove();

	};

	/**
	 * Updates the view state according to the current completed state.
	 *
	 * @private
	 */
	pt.updateView = function () {

		if (this.completed) {

			this.complete();

		} else {

			this.uncomplete();
		}

	};

	/**
	 * Completes the item state.
	 *
	 * @private
	 */
	pt.complete = function () {

		this.elem.find('.toggle').prop('checked', true);
		this.elem.addClass('completed');

	};

	/**
	 * Uncompletes the item state.
	 *
	 * @private
	 */
	pt.uncomplete = function () {

		this.elem.find('.toggle').prop('checked', false);
		this.elem.removeClass('completed');

	};

	/**
	 * Starts editing.
	 *
	 * @private
	 */
	pt.startEditing = function () {

		this.elem.addClass('editing');

	};

	/**
	 * Stops editing.
	 *
	 * @private
	 */
	pt.stopEditing = function (title) {

		this.elem.removeClass('editing');

		if (!title) {

			this.destroy();

			return;

		}

		this.elem.find('label').text(title);

		this.elem.trigger('todo-item-edited', [this.elem.attr('id'), title]);

	};

});


$.cc.assign('todo-item', TodoItem);
