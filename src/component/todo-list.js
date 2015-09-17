
var $ = require('jquery');

var TodoList = $.cc.subclass(function (pt) {
    'use strict';

    pt.constructor = function (elem) {

        this.elem = elem;

    };

    /**
     * Updates the todo items by the given todo model list.
     *
     * @param {TodoCollection} todoList The tood list
     */
    pt.update = function (todoList) {

        this.elem.empty();

        todoList.forEach(function (todo) {

            $('<li />').appendTo(this.elem).cc.init('todo-item').update(todo);

        }, this);

    };

});

$.cc.assign('todo-list', TodoList);
