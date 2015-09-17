

var $ = require('jquery');

var Todo = require('./Todo');


/**
 * TodoFactory is the factory for todo.
 *
 * @class
 */
var TodoFactory = $.cc.subclass(function (pt) {
    'use strict';

    /**
     * Creates a todo model from the given todo body.
     *
     * @param {String} todoBody The todo body
     * @return {Todo}
     */
    pt.createByBody = function (todoBody) {

        return this.createFromObject({
            id: this.generateId(),
            body: todoBody,
            done: false
        });

    };

    /**
     * Creates Todo model from the object
     *
     * @param {Object} obj The source object
     * @return {Todo}
     */
    pt.createFromObject = function (obj) {

        return new Todo(obj.id, obj.body, obj.done);

    };

    pt.generateId = function () {

        return '' + Math.floor(Math.random() * 1000000000);

    };

});

module.exports = TodoFactory;
