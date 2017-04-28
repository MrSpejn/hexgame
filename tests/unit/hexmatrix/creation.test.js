const chai = require('chai');
const HexMatrix = require('../../../app/javascript/hexmatrix/creation');
const expect = chai.expect;

const FALSE = false;
describe('HexMatrix', () => {
	describe('createGeneralHexMatrix', () => {
		it('should by default it should start first row from 0 index and row should be equal size', () => {
			const expected = [
				[ true, FALSE, true, FALSE, true, FALSE, true, FALSE ],
				[ FALSE, true, FALSE, true, FALSE, true, FALSE, true ],
				[ true, FALSE, true, FALSE, true, FALSE, true, FALSE ],
				[ FALSE, true, FALSE, true, FALSE, true, FALSE, true ]
			];

			const matrix = HexMatrix.createGeneralHexMatrix(4, 4);
			const occurance = matrix.map(row => row.map( hex => hex != null));

			expect(occurance).to.be.deep.equal(expected);
		});

		it('should allow to create row of different size', () => {
			const expected = [
				[ true, FALSE, true, FALSE, true, FALSE, true],
				[ FALSE, true, FALSE, true, FALSE, true, FALSE],
				[ true, FALSE, true, FALSE, true, FALSE, true ],
				[ FALSE, true, FALSE, true, FALSE, true, FALSE]
			];

			const matrix = HexMatrix.createGeneralHexMatrix(4, 4, 0, FALSE);
			const occurance = matrix.map(row => row.map( hex => hex != null));

			expect(occurance).to.be.deep.equal(expected);
		});

		it ('should allow to start even rows to start at odd indices', () => {
			const expected = [
				[ FALSE, true, FALSE, true, FALSE, true, FALSE],
				[ true, FALSE, true, FALSE, true, FALSE, true],
				[ FALSE, true, FALSE, true, FALSE, true, FALSE],
				[ true, FALSE, true, FALSE, true, FALSE, true ]
			];

			const matrix = HexMatrix.createGeneralHexMatrix(4, 4, 1, false);
			const occurance = matrix.map(row => row.map( hex => hex != null));

			expect(occurance).to.be.deep.equal(expected);
		});
	});

	describe('createCustomHexMatrix', () => {
		it(`should allow to specify additional parameter which is TRUE/FALSE matrix
		declaring whether the field of general matrix should be filled or not`, () => {
			const insertMatrix = [
				[true, true, FALSE, FALSE ],
				[FALSE, true, true, FALSE],
				[true, true, true, true]
			]
			const expected = [
				[ true, FALSE, true, FALSE, FALSE, FALSE, FALSE, FALSE ],
				[ FALSE, FALSE, FALSE, true, FALSE, true, FALSE, FALSE ],
				[ true, FALSE, true, FALSE, true, FALSE, true, FALSE ],
				[ FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE ]
			];

			const matrix = HexMatrix.createCustomHexMatrix(4, 4, insertMatrix);
			const occurance = matrix.map(row => row.map( hex => hex != null));

			expect(occurance).to.be.deep.equal(expected);
		});
	});

	describe('createSimpleHexMatrix', () => {
		it('should return valid matrix for size 3', () => {
			const expected = [
				[FALSE, true, FALSE, true, FALSE],
				[true, FALSE, true, FALSE, true],
				[FALSE, true, FALSE, true, FALSE]
			];

			const matrix = HexMatrix.createSimpleHexMatrix(3);
			const occurance = matrix.map(row => row.map( hex => hex != null));

			expect(occurance).to.deep.equal(expected);
		});
		it('should return valid matrix for size 5', () => {
			const expected = [
				[FALSE, FALSE, true, FALSE, true, FALSE, true, FALSE, FALSE],
				[FALSE, true, FALSE, true, FALSE, true, FALSE, true, FALSE],
				[true, FALSE, true, FALSE, true, FALSE, true, FALSE, true],
				[FALSE, true, FALSE, true, FALSE, true, FALSE, true, FALSE],
				[FALSE, FALSE, true, FALSE, true, FALSE, true, FALSE, FALSE]
			];
			const matrix = HexMatrix.createSimpleHexMatrix(5);
			const occurance = matrix.map(row => row.map( hex => hex != null));

			expect(occurance).to.deep.equal(expected);
		});

		it('should return valid matrix for size 7', () => {
			const expected = [
				[FALSE, FALSE, FALSE, true, FALSE, true, FALSE, true, FALSE, true, FALSE, FALSE, FALSE],
				[FALSE, FALSE, true, FALSE, true, FALSE, true, FALSE, true, FALSE, true, FALSE, FALSE],
				[FALSE, true, FALSE, true, FALSE, true, FALSE, true, FALSE, true, FALSE, true, FALSE],
				[true, FALSE, true, FALSE, true, FALSE, true, FALSE, true, FALSE, true, FALSE, true],
				[FALSE, true, FALSE, true, FALSE, true, FALSE, true, FALSE, true, FALSE, true, FALSE],
				[FALSE, FALSE, true, FALSE, true, FALSE, true, FALSE, true, FALSE, true, FALSE, FALSE],
				[FALSE, FALSE, FALSE, true, FALSE, true, FALSE, true, FALSE, true, FALSE, FALSE, FALSE]
			];
			const matrix = HexMatrix.createSimpleHexMatrix(7);
			const occurance = matrix.map(row => row.map( hex => hex != null));

			expect(occurance).to.deep.equal(expected);

		});

		it ('should throw error when invalid size supplied', () => {
			expect(() => HexMatrix.createSimpleHexMatrix(1)).to.throw();
			expect(() => HexMatrix.createSimpleHexMatrix(6)).to.throw();
		});
	});

	describe('_calculateElementCircle', () => {
		it ('should correctly calculate a circle number for indices of simple hexmatrix', () => {
			const center1 = [2, 4];
			const center2 = [3, 6];

			expect(HexMatrix._calculateElementCircle(2, 4, center1[0], center1[1])).to.be.equal(0);
			expect(HexMatrix._calculateElementCircle(3, 6, center2[0], center2[1])).to.be.equal(0);

			expect(HexMatrix._calculateElementCircle(1, 1, center1[0], center1[1])).to.be.equal(2);
			expect(HexMatrix._calculateElementCircle(0, 5, center1[0], center1[1])).to.be.equal(2);
			expect(HexMatrix._calculateElementCircle(2, 8, center1[0], center1[1])).to.be.equal(2);
			expect(HexMatrix._calculateElementCircle(2, 2, center1[0], center1[1])).to.be.equal(1);
			expect(HexMatrix._calculateElementCircle(1, 3, center1[0], center1[1])).to.be.equal(1);

			expect(HexMatrix._calculateElementCircle(1, 2, center2[0], center2[1])).to.be.equal(3);
			expect(HexMatrix._calculateElementCircle(2, 3, center2[0], center2[1])).to.be.equal(2);
			expect(HexMatrix._calculateElementCircle(1, 4, center2[0], center2[1])).to.be.equal(2);

		});
	});
});
