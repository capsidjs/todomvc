const {on, component} = $.cc;

/**
 * The presenter of the todo app.
 */
@component('todo-app-presenter')
class TodoAppPresenter {
	/**
	 * Gets the current filter.
	 */
	getFilter() {
		return this.elem.cc.get('todoapp').filter;
	}

	/**
	 * Gets the current todo collection of the app.
	 * @return {TodoCollection}
	 */
	getTodos() {
		return this.elem.cc.get('todoapp').todoCollection;
	}

	/**
	 * Updates the controls.
	 * @private
	 */
	@on('todo-app-update.controls')
	updateControls() {
		this.updateFilterBtns();

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
		this.elem.find('.todo-list').cc.get('todo-list').update(this.getDisplayCollection());
	}

	/**
	 * Updates the filter buttons.
	 * @private
	 */
	updateFilterBtns() {
		this.elem.find('.filters').cc.get('filters').setFilter(this.getFilter().name);
	}

	/**
	 * Updates the todo counter.
	 * @private
	 */
	updateTodoCount() {
		this.elem.find('.todo-count').cc.get('todo-count').setCount(this.getTodos().uncompleted().toArray().length);
	}

	/**
	 * Updates the visiblity of components.
	 * @private
	 */
	updateVisibility() {
		if (this.getTodos().isEmpty()) {
			this.elem.find('.main, .footer').css('display', 'none');
		} else {
			this.elem.find('.main, .footer').css('display', 'block');
		}
	}

	/**
	 * Updates the toggle-all button state.
	 * @private
	 */
	updateToggleBtnState() {
		this.elem.find('.toggle-all').cc.get('toggle-all').updateBtnState(!this.getTodos().uncompleted().isEmpty());
	}

	/**
	 * Gets the todo collection which is displayable in the current filter.
	 * @private
	 */
	getDisplayCollection() {
		return this.getTodos().filterBy(this.getFilter());
	}
}

module.exports = TodoAppPresenter;
