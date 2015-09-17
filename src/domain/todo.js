

var $ = require('jquery');


/**
 * Todo class is the model of single todo item.
 */
var Todo = $.cc.subclass(function (pt) {
    'use strict';

    /**
     * @param {String} id The todo's id
     * @param {String} body The todo's body
     * @param {Boolean} done The flag indicates if it's done or not
     */
    pt.constructor = function (id, body, done) {

        this.id = id;
        this.body = body;
        this.done = done;

    };

});

module.exports = Todo;
