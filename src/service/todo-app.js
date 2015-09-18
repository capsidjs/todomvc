
var $ = require('jquery');

var Const = require('../const');

var TodoFactory = require('../domain/todo-factory');
var TodoRepository = require('../domain/todo-repository');



var TodoApp = $.cc.subclass(function (pt) {
    'use strict'

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

        this.elem.on('todo-new-item', function (e, todoBody) {

            that.addTodo(todoBody);

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

        $(window).on('hashchange', function () {

            that.updateView();

        });

    };

    /**
     * @param {String} todoBody The todo body
     */
    pt.addTodo = function (todoBody) {

        var todo = this.todoFactory.createByBody(todoBody);

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

        this.updateTodoList(this.getDisplayCollection());

        this.updateFilterBtns();

        this.updateTodoCount();

    };

    /**
     * Updates the todo list by the given collection.
     *
     * @param {TodoCollection}
     */
    pt.updateTodoList = function (todoCollection) {

        this.elem.find('.todo-list').cc.get('todo-list').update(todoCollection);

    };

    pt.updateFilterBtns = function () {

        var filterName = this.getFilterNameFromHash();

        this.elem.find('.todo-filters').cc.get('todo-filters').setFilter(filterName);

    };

    pt.updateTodoCount = function () {

        this.elem.find('.todo-count').cc.get('todo-count').setCount(this.todoCollection.uncompleted().toArray().length);

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

            this.updateView();

        }

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

        this.save()

    };

    /**
     * Checks if the todo collection is empty
     *
     * @return {Boolean}
     */
    pt.isEmpty = function () {

        return this.todoCollection.isEmpty();

    };

});


$.cc.assign('todo-app', TodoApp);
