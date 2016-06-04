const Todo = require('./todo')

/**
 * TodoFactory is the factory for todo.
 */
class TodoFactory {
  /**
   * Creates a todo model from the given todo title.
   *
   * @param {String} title The todo title
   * @return {Todo}
   */
  createByTitle (title) {
    return this.createFromObject({
      id: this.generateId(),
      title: title,
      completed: false
    })
  }

  /**
   * Creates Todo model from the object
   * @param {Object} obj The source object
   * @return {Todo}
   */
  createFromObject (obj) {
    return new Todo(obj.id, obj.title, obj.completed)
  }

  /**
   * Generates a random id.
   * @private
   */
  generateId () {
    return Math.floor(Math.random() * 1000000000).toString()
  }
}

module.exports = TodoFactory
