

var $ = require('jquery');

var Todo = require('./todo');


/**
 * TodoFactory is the factory for todo.
 *
 * @class
 */
var TodoFactory = $.cc.subclass(function (pt) {
    'use strict';

    /**
     * Creates a todo model from the given todo title.
     *
     * @param {String} title The todo title
     * @return {Todo}
     */
    pt.createByBody = function (title) {

        return this.createFromObject({
            id: this.generateId(),
            title: title,
            completed: false
        });

    };

    /**
     * Creates Todo model from the object
     *
     * @param {Object} obj The source object
     * @return {Todo}
     */
    pt.createFromObject = function (obj) {

        return new Todo(obj.id, obj.title, obj.completed);

    };

    pt.generateId = function () {

        return '' + Math.floor(Math.random() * 1000000000);

    };

});

module.exports = TodoFactory;
