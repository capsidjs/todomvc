



var TodoApp = $.cc.subclass(function (pt, parent) {
    'use strict'

    pt.constructor = function (elem) {

        this.elem = elem;

        this.initEvents();

    };


    pt.initEvents = function () {

        var that = this;

        this.elem.on('todo-new-item', function (e, item) {

            console.log('todo-new-item: ' + item);

            that.addTodo(item);

        });

    };

    pt.addTodo = function (todoBody) {

        var todo = todoFactory.createByBody(todoBody);

        this.todoList.push(todo);

        this.updateTodoList();

    };

    /**
     * Updates the todo list by the current state.
     */
    pt.updateTodoList = function () {

        this.elem.find('.todo-list').cc.get('todo-list').update(todoList);

    };

});


$.cc.assign('todo-app', TodoApp);
