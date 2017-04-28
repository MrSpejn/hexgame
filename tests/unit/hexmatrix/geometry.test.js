const chai = require('chai');
const HexMatrix = require('../../../app/javascript/hexmatrix/creation');
const Geometry = require('../../../app/javascript/hexmatrix/geometry');
const expect = chai.expect;

describe('Hex Matrix Geometry', () => {
	describe('extendHexMatrixWithGeometry', () => {
		const matrix = HexMatrix.createSimpleHexMatrix(5);
		const extended = Geometry.extendHexMatrixWithGeometry(matrix, 120);
		extended.forEach(row => row.forEach(hex => {
			if (hex !== null) {
				expect(hex).to.contain.all.keys(['vertices', 'center', 'asString']);
			}
		}));
	});
	describe('extendWith2DCoordinates', () => {
		const matrix = HexMatrix.createSimpleHexMatrix(5);
		const h1 = matrix[1][3];
		const model = Geometry._generateVertexModel(50, 60);
		const extended = Geometry._extendWith2DCoordinates(h1, 50, 60, model);

		expect(extended).to.contain.all.keys(['vertices', 'center', 'asString']);
		expect(extended.asString).to.be.a('string');
		expect(extended.center).to.be.an('object');
		expect(extended.center).to.have.all.keys(['x', 'y']);
		expect(extended.vertices).to.be.instanceof(Array);
		expect(extended.vertices).to.be.lengthOf(6);
		extended.vertices.forEach(vertex => {
			expect(vertex).to.be.an('object');
			expect(vertex).to.have.all.keys(['x', 'y']);
		});

	});
	describe('find2DCenterCoordinates', () => {
		const matrix = HexMatrix.createSimpleHexMatrix(5);
		const h1 = matrix[1][3];
		const h2 = matrix[2][2];

		const c1 = Geometry._find2DCenterCoordinates(h1, 50, 60);
		const c2 = Geometry._find2DCenterCoordinates(h2, 50, 60);

		expect(c1.x).to.be.closeTo(100, 0.5);
		expect(c1.y).to.be.closeTo(75, 0.5);
		expect(c2.x).to.be.closeTo(75, 0.5);
		expect(c2.y).to.be.closeTo(120, 0.5);

	});
});
