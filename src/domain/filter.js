const Const = require('../const')

class Filter {
  /**
   */
  constructor (name, isAll) {
    this.name = name
  }

  /**
   * @return {boolean}
   */
  isAll () {
    return this.name === Const.FILTER.ALL
  }
}

Filter.ALL = new Filter(Const.FILTER.ALL)
Filter.ACTIVE = new Filter(Const.FILTER.ACTIVE)
Filter.COMPLETED = new Filter(Const.FILTER.COMPLETED)

module.exports = Filter
