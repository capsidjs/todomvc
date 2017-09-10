require('..')

global.$ = require('jquery')
require('capsid/jquery')(require('capsid'), global.$)

const chai = require('chai')
const dirtyChai = require('dirty-chai')
chai.use(dirtyChai)

/**
 * Triggers the event of the type at the given element with the given detail.
 * @param {any} el The element
 * @param {string} type The type
 * @param {any} detail The detail of the event
 */
exports.trigger = (el, type, detail) => {
  $(el)[0].dispatchEvent(new CustomEvent(type, {detail, bubbles: true}))
}
