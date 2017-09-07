const Filter = require('./filter')

/**
 * TodoCollection is the colleciton model of the todo model.
 */
class TodoCollection {
  /**
   * @param {Todo[]} todos The todo items
   */
  constructor (todos) {
    todos = todos || []

    this.items = todos

    this.map = {}

    this.items.forEach(todo => {
      this.map[todo.id] = todo
    })
  }

  /**
   * Gets the todo by the id.
   *
   * @param {String} id The todo id
   * @return {Todo}
   */
  getById (id) {
    return this.map[id]
  }

  /**
   * Toggles the todo's completed flag by the given id.
   * @param {String} id The todo id
   */
  toggleById (id) {
    const todo = this.getById(id)

    todo.completed = !todo.completed
  }

  /**
   * Iterates calling of func in the given context.
   * @param {Function} func The iteration function
   * @param {Object} ctx The context
   */
  forEach (func, ctx) {
    this.items.forEach(func, ctx)
  }

  /**
   * Pushes (appends) the given todo at the end of the list
   *
   * @param {Todo} todo The todo
   */
  push (todo) {
    this.items.push(todo)

    this.map[todo.id] = todo
  }

  /**
   * Removes the todo.
   * @param {Todo} todo The todo to remvoe
   */
  remove (todo) {
    if (!this.has(todo)) {
      throw new Error(
        'The colletion does not have the todo: ' + todo.toString()
      )
    }

    this.items.splice(this.items.indexOf(todo), 1)
    delete this.map[todo.id]
  }

  /**
   * Removes the item by the id.
   * @param {String} id The todo id
   */
  removeById (id) {
    const todo = this.getById(id)

    if (todo) {
      this.remove(todo)
    }
  }

  /**
   * Checks if the given todo is included by the list
   * @private
   * @param {Todo} todo The todo
   */
  has (todo) {
    return this.items.indexOf(todo) !== -1
  }

  /**
   * Returns a todo subcollection of completed items.
   * @return {TodoCollection}
   */
  completed () {
    return new TodoCollection(this.items.filter(todo => todo.completed))
  }

  /**
   * Returns a todo subcollection of uncompleted items.
   * @return {TodoCollection}
   */
  uncompleted () {
    return new TodoCollection(this.items.filter(todo => !todo.completed))
  }

  /**
   * Gets the array of todos
   * @return {Todo[]}
   */
  toArray () {
    return this.items.slice(0)
  }

  /**
   * Checks if the collection is empty.
   * @param {Boolean}
   */
  isEmpty () {
    return this.length === 0
  }

  /**
   * Returns the length.
   * @return {number}
   */
  get length () {
    return this.items.length
  }

  /**
   * Completes all the todos.
   */
  completeAll () {
    this.items.forEach(todo => {
      todo.completed = true
    })
  }

  /**
   * Uncompletes all the todos.
   */
  uncompleteAll () {
    this.items.forEach(todo => {
      todo.completed = false
    })
  }

  /**
   * Returns the filtered todos by the given filter object.
   * @param {Filter} filter The filter
   * @return {TodoCollection}
   */
  filterBy (filter) {
    if (filter === Filter.ACTIVE) {
      return this.uncompleted()
    } else if (filter === Filter.COMPLETED) {
      return this.completed()
    }

    return this
  }
}

module.exports = TodoCollection
