
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

    };


    pt.initEvents = function () {

        var that = this;

        this.elem.on('todo-new-item', function (e, item) {

            console.log('todo-new-item: ' + item);

            that.addTodo(item);

        });

    };

    /**
     * @param {String} todoBody The todo body
     */
    pt.addTodo = function (todoBody) {

        var todo = this.todoFactory.createByBody(todoBody);

        console.log(todo);

        this.todoCollection.push(todo);

        this.todoRepository.saveAll(this.todoCollection);

        this.updateTodoList();

    };

    /**
     * Updates the todo list by the current state.
     */
    pt.updateTodoList = function () {

        this.elem.find('.todo-list').cc.get('todo-list').update(this.todoCollection);

    };

});


$.cc.assign('todo-app', TodoApp);
