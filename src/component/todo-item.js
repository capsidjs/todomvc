import trigger from '../util/trigger';

const {div, input, label, button} = require('dom-gen');

const {on, wire, component} = require('capsid');

/**
 * TodoItem class controls todo item in a list.
 */
@component
class TodoItem {
	__init__() {
		this.$el.append(
			div(
				input({attr: {type: 'checkbox'}}).addClass('toggle'),
				label(),
				button().addClass('destroy')
			).addClass('view'),
			input().cc('edit')
		);
	}

	/**
	 * @return {Edit}
	 */
	@wire get edit() {}

	/**
	 * Updates the todo title by todo model.
	 * @param {Todo} todo The todo
	 * @param {String} todo.id The id
	 * @param {String} todo.title The title
	 * @param {Boolean} todo.completed If completed or not
	 */
	update(todo) {
		this.elem.attr('id', todo.id);
		this.elem.find('label').text(todo.title);
		this.edit.onUpdate(todo.title);

		this.completed = todo.completed;
		this.updateView();
	}

	/**
	 * Toggles the completed state of the item.
	 * @private
	 */
	@on('click', {at: '.toggle'})
	toggleCompleted() {
		trigger(this.el, 'todo-item-toggle', this.elem.attr('id'));

		this.completed = !this.completed;
		this.updateView();
	}

	/**
	 * Destroys the item.
	 * @private
	 */
	@on('click', {at: '.destroy'})
	destroy() {
		trigger(this.el.parentElement, 'todo-item-destroy', this.$el.attr('id'));

		this.$el.remove();
	}

	/**
	 * Updates the view state according to the current completed state.
	 * @private
	 */
	updateView() {
		if (this.completed) {
			this.complete();
		} else {
			this.uncomplete();
		}
	}

	/**
	 * Completes the item state.
	 * @private
	 */
	complete() {
		this.elem.find('.toggle').prop('checked', true);
		this.elem.addClass('completed');
	}

	/**
	 * Uncompletes the item state.
	 * @private
	 */
	uncomplete() {
		this.elem.find('.toggle').prop('checked', false);
		this.elem.removeClass('completed');
	}

	/**
	 * Starts editing.
	 * @private
	 */
	@on('dblclick', {at: 'label'})
	startEditing() {
		this.elem.addClass('editing');
		this.edit.onStart();
	}

	/**
	 * Stops editing.
	 * @private
	 */
	@on('todo-edited')
	stopEditing(e) {
		const title = e.detail;

		this.$el.removeClass('editing');

		if (!title) {
			this.destroy();

			return;
		}

		this.$el.find('label').text(title);

		trigger(this.el, 'todo-item-edited', {id: this.$el.attr('id'), title});
	}
}

module.exports = TodoItem;
