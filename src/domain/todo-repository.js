const Const = require('../const')
const TodoCollection = require('./todo-collection')

class TodoRepository {
  /**
   * Gets all the todo items.
   *
   * @return {TodoList}
   */
  getAll () {
    const json = window.localStorage[Const.STORAGE_KEY.TODO_LIST]

    if (!json) {
      return new TodoCollection([])
    }

    let array

    try {
      array = JSON.parse(json)
    } catch (err) {
      array = []
    }

    return new TodoCollection(array)
  }

  /**
   * Saves all the todo items.
   * @param {domain.TodoCollection} todos
   */
  saveAll (todos) {
    const json = JSON.stringify(this.collectionToArray(todos))

    window.localStorage[Const.STORAGE_KEY.TODO_LIST] = json
  }

  /**
   * Converts the todo collections into js array of objects.
   * @private
   * @param {TodoCollection} todos The todo collection
   * @return {Array<Object>}
   */
  collectionToArray (todos) {
    return todos.toArray().map(todo => this.toObject(todo))
  }

  /**
   * Converts the todo item into js object.
   * @private
   * @param {Todo} todo The todo item
   * @return {Object}
   */
  toObject (todo) {
    return {
      id: todo.id,
      title: todo.title,
      completed: todo.completed
    }
  }
}

module.exports = TodoRepository
