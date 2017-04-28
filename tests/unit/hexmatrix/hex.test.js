const chai = require('chai');
const HexMatrix = require('../../../app/javascript/hexmatrix/creation');
const Hex = require('../../../app/javascript/hexmatrix/hex');
const expect = chai.expect;

describe('Hex', () => {
	describe('getAdjacent', () => {
		it('should return correct adjecent hexes', () => {
			const matrix = HexMatrix.createSimpleHexMatrix(5);

			expect(Hex.getAdjacent(matrix, [0, 2])).to.be.lengthOf(3);
			expect(Hex.getAdjacent(matrix, [3, 7])).to.be.lengthOf(4);
			expect(Hex.getAdjacent(matrix, [2, 6])).to.be.lengthOf(6);
			expect(Hex.getAdjacent(matrix, [2, 0])).to.be.deep.equal([[3,1],[1,1],[2,2]]);
		});
	});
	describe('getSurrounding', () => {
		it('should return correctly return hexes apart given distance', () => {
			const matrix = HexMatrix.createSimpleHexMatrix(7);

			const set1 = Hex.getSurrounding(matrix, [3, 0], 1);
			const set2 = Hex.getSurrounding(matrix, [2, 9], 2);
			const set3 = Hex.getSurrounding(matrix, [3, 0], 2);
			const set4 = Hex.getSurrounding(matrix, [3, 8], 2);

			expect(set1).to.be.lengthOf(3);
			expect(set2).to.be.lengthOf(9);
			expect(set3).to.be.lengthOf(5);
			expect(set4).to.be.lengthOf(12);

		});
		it('should return hexes whose distance is lower or equal', () => {
			const matrix = HexMatrix.createSimpleHexMatrix(7);

			const set1 = Hex.getSurrounding(matrix, [3, 0], 1, true);
			const set2 = Hex.getSurrounding(matrix, [2, 9], 2, true);
			const set3 = Hex.getSurrounding(matrix, [3, 0], 2, true);
			const set4 = Hex.getSurrounding(matrix, [3, 8], 2, true);

			expect(set1).to.be.lengthOf(4);
			expect(set2).to.be.lengthOf(16);
			expect(set3).to.be.lengthOf(9);
			expect(set4).to.be.lengthOf(19);
		});
	});
	describe('doesHexExist', () => {
		it('should correctly return true for existing hexes', () => {
			const matrix = HexMatrix.createSimpleHexMatrix(5);
			expect(Hex.doesHexExist(matrix, [1, 5])).to.be.equal(true);
			expect(Hex.doesHexExist(matrix, [2, 6])).to.be.equal(true);
		});
		it("should gracefully report if there is no hex at given indices", () => {
			const matrix = HexMatrix.createSimpleHexMatrix(5);
			expect(Hex.doesHexExist(matrix, [0, 0])).to.be.equal(false);
			expect(Hex.doesHexExist(matrix, [1, 4])).to.be.equal(false);
			expect(Hex.doesHexExist(matrix, [2, 3])).to.be.equal(false);
		});
	});
	describe('distanceBetween', () => {
		it('should return distance between hexes', () => {
			const matrix = HexMatrix.createSimpleHexMatrix(5);
			const h1 = matrix[3][1];
			const h2 = matrix[0][4];
			const h3 = matrix[2][8];
			expect(Hex.distanceBetween(h1, h2)).to.be.equal(3);
			expect(Hex.distanceBetween(h1, h3)).to.be.equal(4);
			expect(Hex.distanceBetween(h3, h2)).to.be.equal(3);
		});
	});
	describe('haveInSetAdjacent', () => {
		it('should check if in the set there is hex adjacent to the hex provided', () => {
			const matrix = HexMatrix.createSimpleHexMatrix(5);
			const set = [matrix[3][1], matrix[2][2], matrix[1][1]];
			const h1 = matrix[2][4];
			const h2 = matrix[3][5];
			expect(Hex.haveInSetAdjacent(h1, set)).to.be.equal(true);
			expect(Hex.haveInSetAdjacent(h2, set)).to.be.equal(false);

		});
	});
	describe('areAdjacent', () => {
		it('should return whether hexes are adjecent or not', () => {
			const matrix = HexMatrix.createSimpleHexMatrix(5);

			const h1 = matrix[3][1];
			const h2 = matrix[2][2];
			const h3 = matrix[1][1];

			expect(Hex.areAdjacent(h1, h2)).to.be.equal(true);
			expect(Hex.areAdjacent(h2, h3)).to.be.equal(true);
			expect(Hex.areAdjacent(h1, h3)).to.be.equal(false);
		});
	});
});
