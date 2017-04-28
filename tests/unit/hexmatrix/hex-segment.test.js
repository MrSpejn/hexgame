const chai = require('chai');
const HexMatrix = require('../../../app/javascript/hexmatrix/creation');
const HexSegment = require('../../../app/javascript/hexmatrix/hex-segment');
const Geometry = require('../../../app/javascript/hexmatrix/geometry');
const Manipulation = require('../../../app/javascript/hexmatrix/manipulation');

const expect = chai.expect;

describe('Hex Segment', () => {
	describe('isSetValidSegment', () => {
		it('should assess whether set is a segment', () => {
			const matrix = HexMatrix.createSimpleHexMatrix(5);
			const indices1 = [[1,1],[1,3],[2,0],[2,4],[3,1],[3,3]];
			const indices2 = [[1,1],[2,0],[2,4]];
			const segment1 = Manipulation.getSet(matrix, indices1);
			const segment2 = Manipulation.getSet(matrix, indices2);

			expect(HexSegment.isSetValidSegment(matrix, segment1)).to.be.equal(true);
			expect(HexSegment.isSetValidSegment(matrix, segment2)).to.be.equal(false);
		});
	});
	describe('getSegmentOutlines', () => {
		it('should create outline of the segment', () => {
			const matrix = HexMatrix.createSimpleHexMatrix(5);
			const extended = Geometry.extendHexMatrixWithGeometry(matrix, 50);
			const indices = [[1,1],[1,3],[2,0],[2,4],[3,1],[3,3]];
			const segment = Manipulation.getSet(extended, indices);

			const outline = HexSegment.getSegmentOutlines(extended, segment);

			expect(outline).to.be.lengthOf(2);
			const longer =  outline[0].length > outline[1].length ? 0 : 1;
			expect(outline[longer]).to.be.lengthOf(18);
			expect(outline[longer == 1 ? 0 : 1]).to.be.lengthOf(6);

		});

		it('should be able to skip segment validation', () => {
			const matrix = HexMatrix.createSimpleHexMatrix(5);
			const extended = Geometry.extendHexMatrixWithGeometry(matrix, 50);
			const wrongSegment = [extended[1][1], extended[2][0], extended[2][4]];

			const withValidation = () => HexSegment.getSegmentOutlines(extended, wrongSegment);
			const withoutValidation = () => HexSegment.getSegmentOutlines(extended, wrongSegment, false);

			expect(withValidation).to.throw("Invalid segment");
			expect(withoutValidation).to.not.throw(Error);
		});
	});
});
