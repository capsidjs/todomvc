const { expect } = require('chai')
const { make } = require('capsid')

const { Filter } = require('../../domain')
const { ACTION: { CHANGE_FILTER } } = require('../../const')

let target
let router

describe('router', () => {
  beforeEach(() => {
    target = document.createElement('div')
    router = make('router', target)
  })

  it('triggers the filterchange event to the target with ACTIVE filter when the route is #/active', done => {
    target.addEventListener(CHANGE_FILTER, ({ detail: filter }) => {
      expect(filter).to.equal(Filter.ACTIVE)
      done()
    })

    router['#/active']()
  })

  it('triggers the filterchange event to the target with COMPLETED filter when the route is #/completed', done => {
    target.addEventListener(CHANGE_FILTER, ({ detail: filter }) => {
      expect(filter).to.equal(Filter.COMPLETED)
      done()
    })

    router['#/completed']()
  })

  it('triggers the filterchange event to the target with ALL filter when the route is #/all', done => {
    target.addEventListener(CHANGE_FILTER, ({ detail: filter }) => {
      expect(filter).to.equal(Filter.ALL)
      done()
    })

    router['#/all']()
  })

  it('triggers the filterchange event to the target with ALL filter when the route is otherwise', done => {
    target.addEventListener(CHANGE_FILTER, ({ detail: filter }) => {
      expect(filter).to.equal(Filter.ALL)
      done()
    })

    router['*']()
  })
})
