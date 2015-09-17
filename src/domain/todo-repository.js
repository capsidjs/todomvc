

var $ = require('jquery');
var Const = require('../const');

var TodoCollection = require('./todo-collection');



var TodoRepository = $.cc.subclass(function (pt) {
    'use strict';

    /**
     * Gets all the todo items.
     *
     * @return {TodoList}
     */
    pt.getAll = function () {

        var json = window.localStorage[Const.STORAGE_KEY.TODO_LIST];

        if (!json) {

            return new TodoCollection([]);

        }

        var array;

        try {

            array = JSON.parse(json);

        } catch (e) {

            array = []

        }

        return new TodoCollection(array);

    };

    /**
     * Saves all the todo items.
     *
     * @param {domain.TodoCollection} todos
     */
    pt.saveAll = function (todos) {

        var json = JSON.stringify(this.collectionToArray(todos));

        window.localStorage[Const.STORAGE_KEY.TODO_LIST] = json;

    };

    /**
     * Converts the todo collections into js array of objects.
     *
     * @private
     * @param {TodoCollection} todos The todo collection
     * @return {Array<Object>}
     */
    pt.collectionToArray = function (todos) {

        return todos.toArray().map(function (todo) {

            return this.toObject(todo);

        }, this);

    };

    /**
     * Converts the todo item into js object.
     *
     * @private
     * @param {Todo} todo The todo item
     * @return {Object}
     */
    pt.toObject = function (todo) {

        return {
            id: todo.id,
            body: todo.body,
            done: todo.done
        };

    };

});

module.exports = TodoRepository;
