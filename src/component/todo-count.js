const $ = require('jquery')

class TodoCount {
  constructor (elem) {
    this.elem = elem
  }
  setCount (count) {
    this.elem.empty()

    if (count === 1) {
      this.elem.text(' item left')
    } else {
      this.elem.text(' items left')
    }

    $('<strong />').text(count).prependTo(this.elem)
  }
}

$.cc.assign('todo-count', TodoCount)
