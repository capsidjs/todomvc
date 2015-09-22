/* global describe, it */

var $ = require('jquery');

describe('TodoClearBtn', function () {
    'use strict';

    it('triggers todo-clear-completed event when clicked', function (done) {

        var dom = $('<button />');

        dom.cc.init('todo-clear-btn');

        dom.on('todo-clear-completed', function () { done(); });

        dom.click();

    });

});
