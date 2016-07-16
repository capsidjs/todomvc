const {on, component} = $.cc;

/**
 * The presenter of the todo app.
 */
@component('todo-app-presenter')
class TodoAppPresenter {
	/**
	 * Gets the current filter.
	 */
	filter() {
		return this.elem.cc.get('todoapp').filter;
	}

	/**
	 * Gets the current todo collection of the app.
	 * @return {TodoCollection}
	 */
	todos() {
		return this.elem.cc.get('todoapp').todoCollection;
	}

	/**
	 * Updates the controls.
	 * @private
	 */
	@on('todo-app-update.controls')
	updateControls() {
		this.updateFilterBtns();

		this.updateClearCompleted();

		this.updateTodoCount();

		this.updateVisibility();

		this.updateToggleBtnState();
	}

	/**
	 * Updates the todo list.
	 * @private
	 */
	@on('todo-app-update.todo-list')
	updateTodoList() {
		this.elem.find('.todo-list').cc.get('todo-list').update(this.todos().filterBy(this.filter()));
	}

	/**
	 * Updates the filter buttons.
	 * @private
	 */
	updateFilterBtns() {
		this.elem.find('.filters').cc.get('filters').setFilter(this.filter());
	}

	updateClearCompleted() {
		this.elem.find('.clear-completed').css('display', this.todos().completed().isEmpty() ? 'none' : 'inline')
	}

	/**
	 * Updates the todo counter.
	 * @private
	 */
	updateTodoCount() {
		this.elem.find('.todo-count').cc.get('todo-count').setCount(this.todos().uncompleted().length);
	}

	/**
	 * Updates the visiblity of components.
	 * @private
	 */
	updateVisibility() {
		this.elem.find('.main, .footer').css('display', this.todos().isEmpty() ? 'none' : 'block')
	}

	/**
	 * Updates the toggle-all button state.
	 * @private
	 */
	updateToggleBtnState() {
		this.elem.find('.toggle-all').cc.get('toggle-all').updateBtnState(!this.todos().uncompleted().isEmpty());
	}
}

module.exports = TodoAppPresenter;
