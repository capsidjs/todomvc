
var $ = require('jquery');

var TodoList = $.cc.subclass(function (pt) {

    /**
     * Updates the todo items by the given todo model list.
     *
     * @param {TodoList} todoList The tood list
     */
    pt.update = function (todoList) {

        todoList.forEach(function (todo) {

            elem.cc.init('todo-item').update(todo);

        };

    };

});

$.cc.assign('todo-list', TodoList);
