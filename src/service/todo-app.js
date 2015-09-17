



var TodoApp = $.cc.subclass(function (pt, parent) {
    'use strict'

    pt.constructor = function (elem) {

        this.elem = elem;

        this.elem.on('todo-new-item', function (e, item) {

            console.log('todo-new-item: ' + item);

        });

    };

});


$.cc.assign('todo-app', TodoApp);
