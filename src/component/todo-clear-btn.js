

var $ = require('jquery');

$.cc.register('todo-clear-btn', function (elem) {

    elem.on('click', function () {

        elem.trigger('todo-clear-completed');

    });

});
