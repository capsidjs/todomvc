const {expect} = require('chai');
const {ul, li} = require('dom-gen');
const {trigger} = require('../helper');

let todoItem;
let elem;
let parentElem;

describe('todo-edit', () => {
	beforeEach(() => {
		parentElem = ul();

		elem = li().appendTo(parentElem);

		todoItem = elem.cc.init('todo-item');

		todoItem.update({
			id: 'foo',
			title: 'bar',
			completed: false
		});
	});

	it('initializes its content html', () => {
		expect(elem.find('.view')).to.have.length(1);
		expect(elem.find('.view input.toggle[type="checkbox"]')).to.have.length(1);
		expect(elem.find('.view label')).to.have.length(1);
		expect(elem.find('.view button.destroy')).to.have.length(1);
		expect(elem.find('input.edit')).to.have.length(1);
	});

	describe('update', () => {
		it('updates the content by the given todo object', () => {
			expect(elem.attr('id')).to.equal('foo');
			expect(elem.find('label').text()).to.equal('bar');
			expect(elem.find('.edit').val()).to.equal('bar');
			expect(elem.hasClass('completed')).to.be.false;
			expect(elem.find('.toggle').prop('checked')).to.be.false;

			todoItem.update({
				id: 'foo1',
				title: 'bar1',
				completed: true
			});

			expect(elem.attr('id')).to.equal('foo1');
			expect(elem.find('label').text()).to.equal('bar1');
			expect(elem.find('.edit').val()).to.equal('bar1');
			expect(elem.hasClass('completed')).to.be.true;
			expect(elem.find('.toggle').prop('checked')).to.be.true;
		});
	});

	describe('on .toggle click', () => {
		it('toggles the state of the todo', () => {
			elem.find('.toggle').trigger('click');

			expect(elem.hasClass('completed')).to.be.true;
			expect(elem.find('.toggle').prop('checked')).to.be.true;

			elem.find('.toggle').trigger('click');

			expect(elem.hasClass('completed')).to.be.false;
			expect(elem.find('.toggle').prop('checked')).to.be.false;
		});
	});

	describe('on .destroy click', () => {
		it('removes the element', () => {
			expect(elem.parent()).to.have.length(1);

			elem.find('.destroy').trigger('click');

			expect(elem.parent()).to.have.length(0);
		});

		it('triggers the todo-item-destroy event on the parent element', done => {
			parentElem.on('todo-item-destroy', e => {
				const id = e.detail;

				expect(id).to.equal('foo');

				done();
			});

			elem.find('.destroy').trigger('click');
		});
	});

	describe('on label dblclick', () => {
		it('adds editing class to the element', () => {
			trigger(elem.find('label'), 'dblclick');

			expect(elem.hasClass('editing')).to.be.true;
		});
	});

	describe('on todo-edited event', () => {
		it('removes editing class', () => {
			trigger(elem.find('label'), 'dblclick');

			expect(elem.hasClass('editing')).to.be.true;

			trigger(elem, 'todo-edited');

			expect(elem.hasClass('editing')).to.be.false;
		});

		it('removes the element when the todo title is empty', () => {
			trigger(elem, 'todo-edited', '');

			expect(elem.parent()).to.have.length(0);
		});

		it('updates label when the todo title is not empty', () => {
			trigger(elem, 'todo-edited', 'ham egg');

			expect(elem.find('label').text()).to.equal('ham egg');
		});

		it('triggers todo-item-edited button when the todo title is not empty', done => {
			elem.on('todo-item-edited', e => {
				const {id, title} = e.detail;

				expect(id).to.equal('foo');
				expect(title).to.equal('ham egg');

				done();
			});

			trigger(elem, 'todo-edited', 'ham egg');
		});
	});
});
