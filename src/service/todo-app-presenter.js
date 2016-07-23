const {on, component, wire} = $.cc;

/**
 * The presenter of the todo app.
 */
@component('todo-app-presenter')
class TodoAppPresenter {
	/**
	 * Gets the todoapp.
	 * @return {Todoapp}
	 */
	@wire get todoapp() {}
	/**
	 */
	@wire get 'todo-list'() {}
	@wire get filters() {}
	@wire get 'todo-count'() {}
	@wire get 'toggle-all'() {}

	/**
	 * Gets the current filter.
	 */
	filter() {
		return this.todoapp.filter;
	}

	/**
	 * Gets the current todo collection of the app.
	 * @return {TodoCollection}
	 */
	todos() {
		return this.todoapp.todoCollection;
	}

	/**
	 * Updates the controls.
	 * @private
	 */
	@on('todo-app-update.controls')
	updateControls() {
		// updates filter buttons
		this.filters.setFilter(this.filter());

		// updates visibility of clear-completed area
		this.elem.find('.clear-completed').css('display', this.todos().completed().isEmpty() ? 'none' : 'inline');

		// updates todo count
		this['todo-count'].setCount(this.todos().uncompleted().length);

        // updates visibility of main and footer area
		this.elem.find('.main, .footer').css('display', this.todos().isEmpty() ? 'none' : 'block');

        // updates toggle-all button state
		this['toggle-all'].updateBtnState(!this.todos().uncompleted().isEmpty());
	}

	/**
	 * Updates the todo list.
	 * @private
	 */
	@on('todo-app-update.todo-list')
	updateTodoList() {
		this['todo-list'].update(this.todos().filterBy(this.filter()));
	}
}

module.exports = TodoAppPresenter;
