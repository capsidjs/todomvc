const {expect} = require('chai');
const {input} = require('dom-gen');

const Const = require('../../src/const');

let elem;

describe('TodoInput', () => {
	beforeEach(() => {
		elem = input().val('abc');

		elem.cc.init('new-todo');
	});

	describe('on keypress', () => {
		it('does nothing when the keycode is not ENTER', () => {
			elem.trigger($.Event('keypress', {which: 32})); // eslint-disable-line babel/new-cap

			expect(elem.val()).to.equal('abc');
		});

		it('does nothing when the keycode is ENTER and the value is whitespace', () => {
			elem.val('   ');

			elem.trigger($.Event('keypress', {which: Const.KEYCODE.ENTER})); // eslint-disable-line babel/new-cap

			expect(elem.val()).to.equal('   ');
		});

		it('empties the value and triggers todo-new-item event', done => {
			elem.on('todo-new-item', (e, title) => {
				expect(title).to.equal('abc');

				done();
			});

			elem.trigger($.Event('keypress', {which: Const.KEYCODE.ENTER})); // eslint-disable-line babel/new-cap
		});
	});
});
