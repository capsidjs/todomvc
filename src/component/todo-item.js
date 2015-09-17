


var TodoItem = $.cc.subclass(function (pt) {
    'use strict';

    pt.constructor = function (elem) {

        this.elem = elem;

    };

    pt.complete = function () {

        this.elem.addClass('completed');

    };

    pt.uncomplete = function () {

        this.elem.removeClass('completed');

    };

    pt.startEditing = function () {

        this.elem.addClass('editing');

    };

    pt.stopEditing = function () {

        this.elem.removeClass('editing');

    };

});


$.cc.assign('todo-item', TodoItem);
