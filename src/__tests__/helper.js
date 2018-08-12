require('..')

/**
 * Triggers the event of the type at the given element with the given detail.
 * @param {HTMLElement} el The element
 * @param {string} type The type
 * @param {any} detail The detail of the event
 */
exports.trigger = (el, type, detail) =>
  el.dispatchEvent(new CustomEvent(type, { detail, bubbles: true }))
