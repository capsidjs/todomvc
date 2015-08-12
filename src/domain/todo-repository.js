


domain.TodoRepository = subclass(function (pt) {
    'use strict';

    /**
     * Gets all the todo items.
     *
     * @return {domain.TodoCollection}
     */
    pt.getAll = function () {

        var json = window.localStorage[KEY_TODO_LIST];

        if (!json) {

            return new domain.TodoCollection([]);

        }

        var array;

        try {

            array = JSON.parse(json);

        } catch (e) {

            array = []

        }

        return new domain.TodoCollection(array);

    };

    /**
     * Saves all the todo items.
     *
     * @param {domain.TodoCollection} todos
     */
    pt.saveAll = function (todos) {

        var json = JSON.stringify(this.collectionToArray(todos));

        window.localStorage[KEY_TODO_LIST] = json;

    };

    /**
     * Converts the todo collections into js array of objects.
     *
     * @private
     * @param {TodoCollection} todo The todo collection
     * @return {Array<Object>}
     */
    pt.collectionToArray = function (todos) {

        return todos.toArray().map(function (todo) {

            return this.toObject(todo);

        }, this);

    };

    /**
     * Converts the todo item into js object.
     *
     * @private
     * @param {domain.Todo} todo The todo item
     * @return {Object}
     */
    pt.toObject = function (todo) {

        return {
            name: todo.name,
            done: todo.done
        };

    };

});
