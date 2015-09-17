

var $ = require('jquery');
var Const = require('../const');



var TodoInput = $.cc.subclass(function (pt) {

    pt.constructor = function (elem) {

        this.elem = elem;

        var that = this;


        this.elem.on('keypress', function (e) {

            console.log

            that.onKeypress(e);

        });

    };

    pt.onKeypress = function (e) {

        if (e.which !== Const.KEYCODE.ENTER || !this.elem.val().trim()) {

            return;

        }

        var todoBody = this.elem.val();
        this.elem.val('');

        this.elem.trigger('todo-new-item', todoBody);

    };

});


$.cc.assign('todo-input', TodoInput);
