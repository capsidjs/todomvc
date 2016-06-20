const {component} = $.cc

/**
 * The todo filter controls.
 */
void
@component('filters')
class {

  /**
   * Sets the given filter button active.
   * @param {String} name The name of the filter
   */
  setFilter (name) {
    this.elem.find('a').removeClass('selected')

    if (name === '/active') {
      this.elem.find('a[name="active"]').addClass('selected')
    } else if (name === '/completed') {
      this.elem.find('a[name="completed"]').addClass('selected')
    } else {
      this.elem.find('a[name="all"]').addClass('selected')
    }
  }
}
