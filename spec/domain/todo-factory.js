/* global describe, it, expect, beforeEach */
/* jshint expr: true */

var Todo = require('../../src/domain/todo');
var TodoFactory = require('../../src/domain/todo-factory');



describe('TodoFactory', function () {
    'use strict';

    var factory;

    beforeEach(function () {

        factory = new TodoFactory();

    });

    describe('createFromObject', function () {

        it('creates a todo model from the object', function () {

            var todo = factory.createFromObject({id: 'foo', title: 'bar', completed: true});

            expect(todo).to.be.instanceof(Todo);
            expect(todo.id).to.equal('foo');
            expect(todo.title).to.equal('bar');
            expect(todo.completed).to.be.true;

        });

    });

    describe('createByTitle', function () {

        it('creates a todo from the given title', function () {

            var todo = factory.createByTitle('spam');

            expect(todo).to.be.instanceof(Todo);
            expect(todo.id).to.exist;
            expect(todo.title).to.equal('spam');
            expect(todo.completed).to.be.false;

        });

    });

});
