const { expect } = require('chai')

const { Todo } = require('..')

describe('TodoFactory', () => {
  let factory

  beforeEach(() => {
    factory = new Todo.Factory()
  })

  describe('createFromObject', () => {
    it('creates a todo model from the object', () => {
      const todo = factory.createFromObject({
        id: 'foo',
        title: 'bar',
        completed: true
      })

      expect(todo).to.be.instanceof(Todo)
      expect(todo.id).to.equal('foo')
      expect(todo.title).to.equal('bar')
      expect(todo.completed).to.equal(true)
    })
  })

  describe('createByTitle', () => {
    it('creates a todo from the given title', () => {
      const todo = factory.createByTitle('spam')

      expect(todo).to.be.instanceof(Todo)
      expect(todo.id).to.not.equal(null)
      expect(todo.title).to.equal('spam')
      expect(todo.completed).to.equal(false)
    })
  })
})
