const { expect } = require('chai')

const { Todo, Filter } = require('..')

let collection
let todo0
let todo1
let todo2

describe('TodoCollection', () => {
  beforeEach(() => {
    todo0 = new Todo('a0', 'spam', true)
    todo1 = new Todo('a1', 'ham', false)
    todo2 = new Todo('a2', 'egg', true)

    collection = new Todo.Collection([todo0, todo1, todo2])
  })

  describe('constructor', () => {
    it('craete an empty contructor if the give array is null', () => {
      collection = new Todo.Collection()

      expect(collection.isEmpty()).to.equal(true)
    })
  })

  describe('getById', () => {
    it('gets the todo by the given id', () => {
      expect(collection.getById('a0')).to.equal(todo0)
      expect(collection.getById('a1')).to.equal(todo1)
      expect(collection.getById('a2')).to.equal(todo2)
    })
  })

  describe('toggleById', () => {
    it('toggles the completed state of the todo of the given id', () => {
      collection.toggleById('a0')

      expect(collection.getById('a0').completed).to.equal(false)
    })
  })

  describe('forEach', () => {
    it('iterates calling the given func in the given context', () => {
      let a = ''

      const Ctx = function () {}

      Ctx.prototype.method = function (title) {
        a += title
      }

      collection.forEach(function (todo) {
        this.method(todo.title)
      }, new Ctx())

      expect(a).to.equal('spamhamegg')
    })
  })

  describe('push', () => {
    it('pushes the given todo at the end of the collection', () => {
      collection.push(new Todo('a3', 'spam ham', false))

      expect(collection.toArray()).to.have.length(4)
    })
  })

  describe('remove', () => {
    it('removes the given todo', () => {
      collection.remove(todo0)

      expect(collection.toArray()).to.have.length(2)
    })

    it('throws when the given todo does not exist', () => {
      expect(function () {
        collection.remove(new Todo('a3', 'spam ham', false))
      }).to.throw(Error)
    })
  })

  describe('removeById', () => {
    it('removes the todo by the id', () => {
      collection.removeById('a0')

      expect(collection.toArray()).to.have.length(2)
    })
  })

  describe('completed', () => {
    it('returns the collection of the completed todos', () => {
      var completed = collection.completed()

      expect(completed).to.be.instanceof(Todo.Collection)
      expect(completed.toArray()).to.have.length(2)
      expect(completed.toArray()[0].id).to.equal('a0')
      expect(completed.toArray()[1].id).to.equal('a2')
    })
  })

  describe('uncompleted', () => {
    it('returns the collection of the uncompleted todos', () => {
      var uncompleted = collection.uncompleted()

      expect(uncompleted).to.be.instanceof(Todo.Collection)
      expect(uncompleted.toArray()).to.have.length(1)
      expect(uncompleted.toArray()[0].id).to.equal('a1')
    })
  })

  describe('toArray', () => {
    it('returns the array of the todos', () => {
      expect(collection.toArray()).to.be.an('array')
      expect(collection.toArray()).to.have.length(3)
      expect(collection.toArray()[0]).to.equal(todo0)
      expect(collection.toArray()[1]).to.equal(todo1)
      expect(collection.toArray()[2]).to.equal(todo2)
    })
  })

  describe('completeAll', () => {
    it('completes all the todos', () => {
      collection.completeAll()

      expect(collection.completed().toArray()).to.have.length(3)
    })
  })

  describe('uncompleteAll', () => {
    it('uncompletes all the todos', () => {
      collection.uncompleteAll()

      expect(collection.completed().toArray()).to.have.length(0)
    })
  })

  describe('filterBy', () => {
    it('filters the todos by the given filter', () => {
      expect(collection.filterBy(Filter.All).toArray()).to.have.length(3)
      expect(collection.filterBy(Filter.ACTIVE).toArray()).to.have.length(1)
      expect(collection.filterBy(Filter.COMPLETED).toArray()).to.have.length(2)
    })
  })
})
