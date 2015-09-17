
var $ = require('jquery');

var Const = require('../const');

var TodoFactory = require('../domain/todo-factory');
var TodoRepository = require('../domain/todo-repository');



var TodoApp = $.cc.subclass(function (pt, parent) {
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
     */
    pt.updateView = function () {

        this.updateTodoList(this.getDisplayCollection());

    };

    /**
     * Updates the todo list by the given collection.
     *
     * @param {TodoCollection}
     */
    pt.updateTodoList = function (todoCollection) {

        this.elem.find('.todo-list').cc.get('todo-list').update(todoCollection);

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

    pt.clearCompleted = function () {

        this.todoCollection = this.todoCollection.completed();

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
