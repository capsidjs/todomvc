


var $ = require('jquery');

var TodoCollection = $.cc.subclass(function (pt) {
    'use strict';

    /**
     * @param {Todo[]} todos The todo items
     */
    pt.constructor = function (todos) {

        todos = todos || [];

        this.items = todos;

        this.map = {};

        this.items.forEach(function (todo) {

            this.map[todo.id] = todo;

        }, this);

    };

    pt.getById = function (id) {

        return this.map[id];

    };

    pt.toggleById = function (id) {

        var todo = this.getById(id);

        todo.completed = !todo.completed;

    };

    /**
     * Iterates calling of func in the given context.
     *
     * @param {Function} func The iteration function
     * @param {Object} ctx The context
     */
    pt.forEach = function (func, ctx) {

        this.items.forEach(func, ctx);

    };

    /**
     * Pushes (appends) the given todo at the end of the list
     *
     * @param {Todo} todo The todo
     */
    pt.push = function (todo) {

        this.items.push(todo);

        this.map[todo.id] = todo;

    };

    /**
     * Unshifts (prepends) the given todo to the list.
     *
     * @param {Todo} todo The todo
     */
    pt.unshift = function (todo) {

        this.items.unshift(todo);

    };

    /**
     * @param {Todo} todo The todo to remvoe
     */
    pt.remove = function (todo) {

        if (!this.has(todo)) {

            throw new Error('The colletion does not have the todo: ' + todo.toString());

        }

        this.items.splice(this.items.indexOf(todo), 1);

    };

    /**
     * Removes the item by the id.
     *
     * @param {String} id The todo id
     */
    pt.removeById = function (id) {

        this.remove(this.getById(id));

    };

    /**
     * Checks if the given todo is included by the list
     *
     * @param {Todo} todo The todo
     */
    pt.has = function (todo) {

        return this.items.indexOf(todo) !== -1;

    };

    /**
     * Returns a todo subcollection of completed items.
     *
     * @return {TodoCollection}
     */
    pt.completed = function () {

        return new TodoCollection(this.items.filter(function (todo) { return todo.completed; }));

    };

    /**
     * Returns a todo subcollection of uncompleted items.
     *
     * @return {TodoCollection}
     */
    pt.uncompleted = function () {

        return new TodoCollection(this.items.filter(function (todo) { return !todo.completed; }));

    };

    /**
     * Gets the array of todos
     *
     * @return {Todo[]}
     */
    pt.toArray = function () {

        return this.items.slice(0);

    };

    /**
     * Checks if the collection is empty.
     *
     * @param {Boolean}
     */
    pt.isEmpty = function () {

        return this.items.length === 0;

    };

    pt.completeAll = function () {

        this.items.forEach(function (todo) {

            todo.completed = true;

        });

    };

    pt.uncompleteAll = function () {

        this.items.forEach(function (todo) {

            todo.completed = false;

        });

    };

});


module.exports = TodoCollection;
