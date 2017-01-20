import cc from 'capsid';

const {expect} = require('chai');
const {input} = require('dom-gen');

const {trigger} = require('../helper');
const Const = require('../../src/const');

let elem;
let todoEdit;

describe('Edit', () => {
	beforeEach(() => {
		elem = input();
		todoEdit = elem.cc.init('edit');
		todoEdit.onUpdate('foo');
	});

	describe('on blur', () => {
		it('triggers todo-edited event when the elem is blurred', done => {
			elem.on('todo-edited', () => done());

			trigger(elem, 'blur');
		});
	});

	describe('onKeypress', () => {
		it('triggers todo-edited event with the edited value when ENTER is pressed', done => {
			elem.on('todo-edited', e => {
				const value = e.detail;

				expect(value).to.equal('bar');
				done();
			});

			elem.val('bar');

			cc.get('edit', elem[0]).onKeypress;

			const e = new CustomEvent('keypress');
			e.which = Const.KEYCODE.ENTER;

			elem[0].dispatchEvent(e);
		});

		it('does nothing when the pressed key is SPACE', done => {
			elem.on('todo-edited', () => done(new Error('todo-edited should not be triggered')));

			const e = new CustomEvent('keypress');
			e.which = 32;

			todoEdit.el.dispatchEvent(e);

			done();
		});

		it('triggers todo-edited event with the value before editing when ESCAPE is pressed', done => {
			elem.on('todo-edited', e => {
				const value = e.detail;

				expect(value).to.equal('foo');
				done();
			});

			elem.val('bar');

			const e = new CustomEvent('keypress');
			e.which = Const.KEYCODE.ESCAPE;

			elem[0].dispatchEvent(e);
		});
	});

	describe('onFinish', () => {
		it('triggers todo-edited events with current value of the input', done => {
			todoEdit.el.addEventListener('todo-edited', e => {
				const value = e.detail;

				expect(value).to.equal('foo');

				done();
			});

			todoEdit.elem.val('foo');

			todoEdit.onFinish();
		});
	});
});
