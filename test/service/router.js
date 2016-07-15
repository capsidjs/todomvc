const {div} = require('dom-gen');
const {expect} = require('chai');

const Filter = require('../../src/domain/filter');

let target;

describe('router', () => {
	before(() => {
		target = div();

		$(window).data('target', target).cc('router');
	});

	it('triggers the filterchange event to the target with ACTIVE filter when the url hash is #/active', done => {
		target.on('filterchange', (e, filter) => {
			target.off('filterchange');
			expect(filter).to.equal(Filter.ACTIVE);
			done();
		});

		window.location.href = '#/active';
	});

	it('triggers the filterchange event to the target with COMPLETED filter when the url hash is #/completed', done => {
		target.on('filterchange', (e, filter) => {
			target.off('filterchange');
			expect(filter).to.equal(Filter.COMPLETED);
			done();
		});

		window.location.href = '#/completed';
	});

	it('triggers the filterchange event to the target with ALL filter when the url hash is #/all', done => {
		target.on('filterchange', (e, filter) => {
			target.off('filterchange');
			expect(filter).to.equal(Filter.ALL);
			done();
		});

		window.location.href = '#/all';
	});

	it('triggers the filterchange event to the target with ALL filter when the url hash is otherwise', done => {
		target.on('filterchange', (e, filter) => {
			target.off('filterchange');
			expect(filter).to.equal(Filter.ALL);
			done();
		});

		window.location.href = '#';
	});
});
