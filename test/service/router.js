const { div } = require('dom-gen')
const { expect } = require('chai')

const { Filter } = require('../../src/domain')
const { ACTION: { CHANGE_FILTER } } = require('../../src/const')

let target
let router

describe('router', () => {
  before(() => {
    target = div().cc('router')
    router = target.cc.get('router')

    $(window).on('hashchange', () => router.onHashchange())
  })

  it('triggers the filterchange event to the target with ACTIVE filter when the url hash is #/active', done => {
    target.on(CHANGE_FILTER, e => {
      const filter = e.detail

      target.off(CHANGE_FILTER)
      expect(filter).to.equal(Filter.ACTIVE)
      done()
    })

    window.location.href = '#/active'
  })

  it('triggers the filterchange event to the target with COMPLETED filter when the url hash is #/completed', done => {
    target.on(CHANGE_FILTER, e => {
      const filter = e.detail

      target.off(CHANGE_FILTER)
      expect(filter).to.equal(Filter.COMPLETED)
      done()
    })

    window.location.href = '#/completed'
  })

  it('triggers the filterchange event to the target with ALL filter when the url hash is #/all', done => {
    target.on(CHANGE_FILTER, e => {
      const filter = e.detail

      target.off(CHANGE_FILTER)
      expect(filter).to.equal(Filter.ALL)
      done()
    })

    window.location.href = '#/all'
  })

  it('triggers the filterchange event to the target with ALL filter when the url hash is otherwise', done => {
    target.on(CHANGE_FILTER, e => {
      const filter = e.detail

      target.off(CHANGE_FILTER)
      expect(filter).to.equal(Filter.ALL)
      done()
    })

    window.location.href = '#'
  })
})
