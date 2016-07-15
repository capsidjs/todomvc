const {expect} = require('chai');
const {div, li} = require('dom-gen');

const Filter = require('../../src/domain/filter');

let filterControl;
let elem;

describe('filters', () => {
	beforeEach(() => {
		elem = div();
		filterControl = elem.cc.init('filters');

		li('<a href="#/" />').appendTo(elem);
		li('<a href="#/active" />').appendTo(elem);
		li('<a href="#/completed" />').appendTo(elem);
	});

	describe('setFilter', () => {
		it('sets the filter button for the given name active', () => {
			filterControl.setFilter(Filter.ALL);

			expect(elem.find('a[href="#/"]').hasClass('selected')).to.be.true;
			expect(elem.find('a[href="#/active"]').hasClass('selected')).to.be.false;
			expect(elem.find('a[href="#/completed"]').hasClass('selected')).to.be.false;

			filterControl.setFilter(Filter.ACTIVE);

			expect(elem.find('a[href="#/"]').hasClass('selected')).to.be.false;
			expect(elem.find('a[href="#/active"]').hasClass('selected')).to.be.true;
			expect(elem.find('a[href="#/completed"]').hasClass('selected')).to.be.false;

			filterControl.setFilter(Filter.COMPLETED);

			expect(elem.find('a[href="#/"]').hasClass('selected')).to.be.false;
			expect(elem.find('a[href="#/active"]').hasClass('selected')).to.be.false;
			expect(elem.find('a[href="#/completed"]').hasClass('selected')).to.be.true;
		});
	});
});
