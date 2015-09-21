
var $ = require('jquery');

var Const = require('../const');

var TodoFactory = require('../domain/todo-factory');
var TodoRepository = require('../domain/todo-repository');



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


    pt.initEvents = function () {

        var that = this;

        this.elem.on('todo-new-item', function (e, title) {

            that.addTodo(title);

        });

        this.elem.on('todo-item-toggle', function (e, id) {

            that.toggle(id);

        });

        this.elem.on('todo-item-destroy', function (e, id) {

            that.remove(id);

        });

        this.elem.on('todo-item-edited', function (e, id, title) {

            that.editItem(id, title);

        });

        this.elem.on('todo-clear-completed', function () {

            that.clearCompleted();

        });

        this.elem.on('todo-complete-all', function () {

            that.completeAll();

        });

        this.elem.on('todo-uncomplete-all', function () {

            that.uncompleteAll();

        });

        $(window).on('hashchange', function () {

            that.updateView();

        });

    };

    /**
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

    pt.updateControls = function () {

        console.log('update contorls');

        this.updateFilterBtns();

        this.updateTodoCount();

        this.updateVisibility();

        this.updateToggleBtnState();

    };

    /**
     * Updates the todo list.
     */
    pt.updateTodoList = function () {

        var todoCollection = this.getDisplayCollection();

        this.elem.find('.todo-list').cc.get('todo-list').update(todoCollection);

    };

    pt.updateFilterBtns = function () {

        var filterName = this.getFilterNameFromHash();

        this.elem.find('.todo-filters').cc.get('todo-filters').setFilter(filterName);

    };

    pt.updateTodoCount = function () {

        this.elem.find('.todo-count').cc.get('todo-count').setCount(this.todoCollection.uncompleted().toArray().length);

    };

    pt.updateVisibility = function () {

        if (this.todoCollection.isEmpty()) {

            this.elem.find('#main, #footer').css('display', 'none');

        } else {

            this.elem.find('#main, #footer').css('display', 'block');

        }

    };

    pt.updateToggleBtnState = function () {

        console.log('updateToggleBtnState');

        this.elem.find('.todo-toggle-all').cc.get('todo-toggle-all').updateBtnState(!this.todoCollection.uncompleted().isEmpty());

    };

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

    pt.filterIsEnabled = function () {

        var filterName = this.getFilterNameFromHash();

        return filterName === Const.FILTER.ACTIVE || filterName === Const.FILTER.COMPLETED;

    };

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
