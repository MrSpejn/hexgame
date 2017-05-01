const chai = require('chai');
const HexMatrix = require('../../../app/javascript/hexmatrix/creation');
const Manipulation = require('../../../app/javascript/hexmatrix/manipulation');
const expect = chai.expect;

describe('Hex Matrix Manipulation', () => {
	describe('hexMatrixToList', () => {
		it('should convert hex matrix to list ', () => {
			const matrix = HexMatrix.createGeneralHexMatrix(4, 6);

			const list = Manipulation.hexMatrixToList(matrix);
			expect(list).to.be.instanceof(Manipulation.HexList);
			expect(list.length());
			list.forEach(el => {
				expect(el).to.be.an('object');
				expect(el).to.have.property('row').that.is.a('number');
				expect(el).to.have.property('col').that.is.a('number');
			});
		});

	});
	describe('getSet', () => {
		it('should return array of corresponding hexes', () => {
			const matrix = HexMatrix.createGeneralHexMatrix(4, 6);
			const valid = [
				matrix[0][0],
				matrix[1][3],
				matrix[2][4]
			];
			expect(Manipulation.getSet(matrix, [[0,0],[1,3],[2,4]])).to.be.deep.equal(valid);
		});
		it('should throw an error if any of the indices are invalid', () => {
			const matrix = HexMatrix.createGeneralHexMatrix(4, 6);
			expect(() => Manipulation.getSet(matrix, [[1, 3], [2, 2], [1, 0]])).to.throw('Invalid indices');
		});
	});
	describe('getCircle', () => {
		it('should return element on given circle', () => {
			const matrix = HexMatrix.createSimpleHexMatrix(7);
			const circle1 = Manipulation.getCircle(matrix, 1);
			const circle2 = Manipulation.getCircle(matrix, 2);
			const circle3 = Manipulation.getCircle(matrix, 3);


			expect(circle1).to.be.lengthOf(6);
			expect(circle2).to.be.lengthOf(12);
			expect(circle3).to.be.lengthOf(18);
		});

		it('should return element on given circle or closer', () => {
			const matrix = HexMatrix.createSimpleHexMatrix(7);
			const circle1 = Manipulation.getCircle(matrix, 1, true);
			const circle2 = Manipulation.getCircle(matrix, 2, true);
			const circle3 = Manipulation.getCircle(matrix, 3, true);


			expect(circle1).to.be.lengthOf(7);
			expect(circle2).to.be.lengthOf(19);
			expect(circle3).to.be.lengthOf(37);
		});

		it('should not accept other hex matrix then simple', () => {
			const matrix = HexMatrix.createGeneralHexMatrix(4, 6);
			expect(() => Manipulation.getCircle(matrix, 3)).to.throw('Only simple matrix have circles');
		})
	});
});
