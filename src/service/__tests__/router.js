const { div } = require('dom-gen')
const { expect } = require('chai')

const { Filter } = require('../../domain')
const { ACTION: { CHANGE_FILTER } } = require('../../const')

let target
let router

describe('router', () => {
  before(() => {
    target = div().cc('router')
    router = target.cc.get('router')
  })

  it('triggers the filterchange event to the target with ACTIVE filter when the route is #/active', done => {
    target.on(CHANGE_FILTER, ({ detail: filter }) => {
      target.off(CHANGE_FILTER)
      expect(filter).to.equal(Filter.ACTIVE)
      done()
    })

    router['#/active']()
  })

  it('triggers the filterchange event to the target with COMPLETED filter when the route is #/completed', done => {
    target.on(CHANGE_FILTER, ({ detail: filter }) => {
      target.off(CHANGE_FILTER)
      expect(filter).to.equal(Filter.COMPLETED)
      done()
    })

    router['#/completed']()
  })

  it('triggers the filterchange event to the target with ALL filter when the route is #/all', done => {
    target.on(CHANGE_FILTER, ({ detail: filter }) => {
      target.off(CHANGE_FILTER)
      expect(filter).to.equal(Filter.ALL)
      done()
    })

    router['#/all']()
  })

  it('triggers the filterchange event to the target with ALL filter when the route is otherwise', done => {
    target.on(CHANGE_FILTER, ({ detail: filter }) => {
      target.off(CHANGE_FILTER)
      expect(filter).to.equal(Filter.ALL)
      done()
    })

    router['*']()
  })
})
