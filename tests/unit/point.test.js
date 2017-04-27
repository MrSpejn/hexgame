const chai = require('chai');
const Point = require('../../app/components/point');
const expect = chai.expect;

describe('point', () => {
	describe('pointToString', () => {
		it('create string with joined rounded coordinates', () => {
			const string = Point.pointToString({ x: 12.3, y: 45.1 });
			expect(string).to.be.a('string');
			expect(string).to.be.equal('12 45');
		});

		it('create use correct diameter', () => {
			const point = { x:12.3, y: 45.1 };
			expect(Point.pointToString(point)).to.be.equal('12 45');
			expect(Point.pointToString(point, ",")).to.be.equal('12,45');
		});
	});
});
