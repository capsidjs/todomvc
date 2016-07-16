const {expect} = require('chai');
const {input} = require('dom-gen');

const Const = require('../../src/const');

let elem;
let todoEdit;

describe('TodoEdit', () => {
	beforeEach(() => {
		elem = input();
		todoEdit = elem.cc.init('edit');
		todoEdit.onUpdate('foo')
	});

	describe('on blur', () => {
		it('triggers todo-edited event when the elem is blurred', done => {
			elem.on('todo-edited', () => done());

			elem.trigger('blur');
		});
	})

	describe('onKeypress', () => {
		it('triggers todo-edited event with the edited value when ENTER is pressed', done => {
			elem.on('todo-edited', (e, value) => {
				expect(value).to.equal('bar')
				done()
			});

			elem.val('bar')

			elem.trigger(new $.Event('keypress', {which: Const.KEYCODE.ENTER}));

		});

		it('does nothing when the pressed key is SPACE', done => {
			elem.on('todo-edited', () => done(new Error('todo-edited should not be triggered')));

			todoEdit.elem.trigger(new $.Event('keypress', {which: 32}));

			done();
		});

		it('triggers todo-edited event with the value before editing when ESCAPE is pressed', done => {
			elem.on('todo-edited', (e, value) => {
				expect(value).to.equal('foo')
				done()
			});

			elem.val('bar')

			elem.trigger(new $.Event('keypress', {which: Const.KEYCODE.ESCAPE}));
		});
	});

	describe('onFinish', () => {
		it('triggers todo-edited events with current value of the input', done => {
			todoEdit.elem.trigger = (event, value) => {
				expect(event).to.equal('todo-edited');
				expect(value).to.equal('foo');

				done();
			};

			todoEdit.elem.val('foo');

			todoEdit.onFinish();
		});
	});
});
