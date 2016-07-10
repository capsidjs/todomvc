const {
	div
} = require('dom-gen');
const {
	expect
} = require('chai');

let elem;

describe('filter-observer', () => {
	beforeEach(() => {
		elem = div().cc('filter-observer');
	});

	it('triggers the filterchange event when constructed', done => {
		elem.on('filterchange', () => {
			elem.off('filterchange');
			done();
		});
	});

	it('triggers the filterchange event with /active filter when the url hash is #/active', done => {
		elem.on('filterchange', (e, filter) => {
			elem.off('filterchange');
			expect(filter.name).to.equal('/active');
			done();
		});

		window.location.href = '#/active';
	});

	it('triggers the filterchange event with /completed filter when the url hash is #/completed', done => {
		elem.on('filterchange', (e, filter) => {
			elem.off('filterchange');
			expect(filter.name).to.equal('/completed');
			done();
		});

		window.location.href = '#/completed';
	});
});
