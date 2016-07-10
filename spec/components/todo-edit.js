const {expect} = require('chai');
const {input} = require('dom-gen');

const Const = require('../../src/const');

let elem;
let todoEdit;

describe('TodoEdit', () => {
	beforeEach(() => {
		elem = input();
		todoEdit = elem.cc.init('todo-edit');
	});

	it('triggers todo-edited event when the elem is blurred', done => {
		elem.on('todo-edited', () => done());

		elem.trigger('blur');
	});

	describe('onKeypress', () => {
		it('triggers todo-edited event when the pressed key is ENTER', done => {
			elem.on('todo-edited', () => done());

			const e = $.Event('keypress'); // eslint-disable-line babel/new-cap
			e.which = Const.KEYCODE.ENTER;

			elem.trigger(e);
		});

		it('does nothing when the pressed key is not ENTER', done => {
			elem.on('todo-edited', () => done(new Error('stopEditing should not be called')));

			const e = $.Event('keypress'); // eslint-disable-line babel/new-cap
			e.which = 32;

			todoEdit.elem.trigger(e);

			done();
		});
	});

	describe('stopEditing', () => {
		it('triggers todo-edited events with current value of the input', done => {
			todoEdit.elem.trigger = (event, value) => {
				expect(event).to.equal('todo-edited');
				expect(value).to.equal('foo');

				done();
			};

			todoEdit.elem.val('foo');

			todoEdit.stopEditing();
		});
	});
});
