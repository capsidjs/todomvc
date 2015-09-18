

var $ = require('jquery');

var Const = require('../const');


var TodoEdit = $.cc.subclass(function (pt) {
    'use strict';

    pt.constructor = function (elem) {

        this.elem = elem;

        this.initEvents();

    };

    pt.initEvents = function () {

        var that = this;

        this.elem.on('keypress', function (e) {

            that.onKeypress(e);

        });

    };

    pt.onKeypress = function (e) {

        if (e.which === Const.KEYCODE.ENTER) {

            this.elem.trigger('todo-edited', this.elem.val());

        }

    };

});

$.cc.assign('todo-edit', TodoEdit);
