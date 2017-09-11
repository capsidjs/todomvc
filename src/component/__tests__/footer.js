const { make } = require('capsid')
const { Todo, Filter } = require('../../domain')
const { expect } = require('chai')

describe('footer', () => {
  let el
  let footer

  beforeEach(() => {
    el = document.createElement('footer')

    el.innerHTML = `
      <span class="todo-count"></span>
      <ul class="filters">
        <li>
          <a class="todo-filter" href="#/">All</a>
        </li>
        <li>
          <a class="todo-filter" href="#/active">Active</a>
        </li>
        <li>
          <a class="todo-filter" href="#/completed">Completed</a>
        </li>
      </ul>
      <button class="clear-completed"></button>
    `

    footer = make('footer', el)
  })

  describe('onUpdate', () => {
    it('shows clear completed button if and only if any completed todo exists', () => {
      footer.onUpdate({
        detail: {
          todoCollection: new Todo.Collection([
            new Todo('a0', 'foo', true),
            new Todo('a1', 'bar', false),
            new Todo('a2', 'baz', true)
          ])
        }
      })

      expect(el.querySelector('.clear-completed').style.display).to.not.equal('none')

      footer.onUpdate({
        detail: {
          todoCollection: new Todo.Collection([
            new Todo('a0', 'foo', false),
            new Todo('a1', 'bar', false),
            new Todo('a2', 'baz', false)
          ])
        }
      })

      expect(el.querySelector('.clear-completed').style.display).to.equal('none')
    })

    it('gives selected class to the filter buttons according to the current filter', () => {
      footer.onUpdate({
        detail: {
          todoCollection: new Todo.Collection([
            new Todo('a0', 'foo', false)
          ]),
          filter: Filter.ALL
        }
      })

      expect(el.querySelector('a.todo-filter.selected').getAttribute('href')).to.equal('#/')

      footer.onUpdate({
        detail: {
          todoCollection: new Todo.Collection([
            new Todo('a0', 'foo', false)
          ]),
          filter: Filter.ACTIVE
        }
      })

      expect(el.querySelector('a.todo-filter.selected').getAttribute('href')).to.equal('#/active')

      footer.onUpdate({
        detail: {
          todoCollection: new Todo.Collection([
            new Todo('a0', 'foo', false)
          ]),
          filter: Filter.COMPLETED
        }
      })

      expect(el.querySelector('a.todo-filter.selected').getAttribute('href')).to.equal('#/completed')
    })

    it('shows the number of active todos in .todo-count element', () => {
      footer.onUpdate({
        detail: {
          todoCollection: new Todo.Collection([
            new Todo('a0', 'foo', false),
            new Todo('a1', 'bar', false),
            new Todo('a2', 'baz', true)
          ])
        }
      })

      expect(el.querySelector('.todo-count').textContent).to.equal('2 items left')

      footer.onUpdate({
        detail: {
          todoCollection: new Todo.Collection([
            new Todo('a0', 'foo', false),
            new Todo('a1', 'bar', true),
            new Todo('a2', 'baz', true)
          ])
        }
      })

      expect(el.querySelector('.todo-count').textContent).to.equal('1 item left')

      footer.onUpdate({
        detail: {
          todoCollection: new Todo.Collection([
            new Todo('a0', 'foo', true),
            new Todo('a1', 'bar', true),
            new Todo('a2', 'baz', true)
          ])
        }
      })

      expect(el.querySelector('.todo-count').textContent).to.equal('0 items left')
    })

    it('shows itself if and only if there exists any todo', () => {
      footer.onUpdate({
        detail: {
          todoCollection: new Todo.Collection([
            new Todo('a0', 'foo', true)
          ])
        }
      })

      expect(el.style.display).to.not.equal('none')

      footer.onUpdate({
        detail: {
          todoCollection: new Todo.Collection([
          ])
        }
      })

      expect(el.style.display).to.equal('none')
    })
  })
})
