
var $ = require('jquery');

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

        this.updateTodoList();

    };


    pt.initEvents = function () {

        var that = this;

        this.elem.on('todo-new-item', function (e, todoBody) {

            that.addTodo(todoBody);

        });

        this.elem.on('todo-item-toggle', function (e, id) {

            that.toggle(id);

        });

    };

    /**
     * @param {String} todoBody The todo body
     */
    pt.addTodo = function (todoBody) {

        var todo = this.todoFactory.createByBody(todoBody);

        this.todoCollection.push(todo);

        this.save();

        this.updateTodoList();

    };

    /**
     * Updates the todo list by the current state.
     */
    pt.updateTodoList = function () {

        this.elem.find('.todo-list').cc.get('todo-list').update(this.todoCollection);

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
     * @param {String} id
     */
    pt.toggle = function (id) {

        this.todoCollection.toggleById(id);

        this.save();

    };

});


$.cc.assign('todo-app', TodoApp);
