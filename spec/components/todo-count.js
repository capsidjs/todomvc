const $ = require('jquery')
const {expect} = require('chai')
const {span} = require('dom-gen')

describe('TodoCount', () => {
  describe('setCount', () => {
    it('sets label properly', () => {
      const dom = span()

      const todoCount = dom.cc.init('todo-count')

      todoCount.setCount(0)

      expect(dom.html()).to.equal('<strong>0</strong> items left')

      todoCount.setCount(1)

      expect(dom.html()).to.equal('<strong>1</strong> item left')

      todoCount.setCount(2)

      expect(dom.html()).to.equal('<strong>2</strong> items left')
    })
  })
})
