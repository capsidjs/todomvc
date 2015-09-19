

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
            expect(todo.completed).to.equal(true);

        });

    });

});
