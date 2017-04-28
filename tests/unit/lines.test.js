const chai = require('chai');
const Lines = require('../../app/javascript/geom/lines');
const expect = chai.expect;

describe('Lines', () => {
	describe('distSquared', () => {
		it('should return squared distance between points', () => {
			const p1 = { x: 1.2, y: 3.4 };
			const p2 = { x: 2.3, y: 4.7 };

			expect(Lines._distSquared(p1, p2)).to.be.within(2.89, 2.91);
		});
	});

	describe('indexOf', () => {
		it('should return correct index of point approximately equal to the point supplied', () => {
			const line1 = [{ x: 3.56, y: 4.28 }, { x: 8.23, y: 7.29 }];
			const point1 = { x: 3.12, y: 4.31 };

			const line2 = [ { x: 8.23, y: 7.29 }, { x: 12.23, y: -11.28 }];
			const point2 = { x: 11.96, y: -10.84 };

			expect(Lines._indexOf(line1, point1)).to.be.equal(0);
			expect(Lines._indexOf(line2, point2)).to.be.equal(1);
		});
		it('should return -1 when neither points are approx. equal to point supplied', () => {
			const line  = [ { x: 3.24, y: 7.12}, {x: 12.3, y: 7.84}];
			const point = [ { x: 7.10, y: 3.14 }];

			expect(Lines._indexOf(line, point)).to.be.equal(-1);
		});
	});

	describe('outlineToPathString', () => {
		it('should return correct path string for various number of lines', () => {
			const outline1 = [[{x:12.1, y:15.4}, {x:6.2, y:34.2}], [{x:6.14, y:33.9}, {x:46, y: 17}], [{x: 45.8, y: 17.2}, {x: 13.1, y: 14.9}]]
			const outline2 = [[{x:12.1, y:15.4}, {x:6.2, y:34.2}], [{x:6.14, y:33.9}, {x:46, y: 17}]]
			const outline3 = [[{x:12.1, y:15.4}, {x:6.2, y:34.2}]];

			expect(Lines.outlineToPathString(outline1)).to.be.equal("M 12 15 L 6 34 L 46 17 L 13 15 Z");
			expect(Lines.outlineToPathString(outline2)).to.be.equal("M 12 15 L 6 34 L 46 17 Z");
			expect(Lines.outlineToPathString(outline3)).to.be.equal("M 12 15 L 6 34 Z");
		});
		it('should throw a error for empty outline', () => {
			expect(() => Lines.outlineToPathString([])).to.throw("Outline cannot be empty");
		});
	});

	describe('linesEqual', () => {
		it('should correctly indicate equality', () => {
			const line1 = [{x: 7, y: 8}, {x: 9, y: 10}];
			const line2 = [{x: 6.87, y: 9}, {x: 9.1, y: 10.8}];
			const line3 = [{x: 13.1, y: 17.2}, {x: -4, y: -3.4}];
			const line4 = [{x: -3.6, y: -3.4}, {x: 13.5, y: 16.8}];

			expect(Lines.linesEqual(line1, line2)).to.be.equal(true);
			expect(Lines.linesEqual(line3, line4)).to.be.equal(true);
			expect(Lines.linesEqual(line1, line3)).to.be.equal(false);
		});
	});

	describe('turnAround', () => {
		it('should correctly swap places between ends', () => {

		});
	});

	describe('mapPointsToLines', () => {
		it('should return 3 lines for 3 points', () => {
			const points = [{x: 1, y: 1}, {x:2, y:2}, {x:4, y: 3}];
			const validLines = [
				[{x: 1, y: 1}, {x:2, y:2}],
				[{x:2, y:2}, {x:4, y: 3}],
				[{x:4, y: 3}, {x: 1, y: 1}]
			];

			const lines = Lines.mapPointsToLines(points);

			expect(lines).to.have.property("length").equal(3);
			expect(lines).to.be.deep.equal(validLines);

		});
		it('should return 1 line for 2 points', () => {
			const points = [{x:2, y:2}, {x:4, y: 3}];
			const validLines = [[{x:2, y:2}, {x:4, y: 3}]];

			const lines = Lines.mapPointsToLines(points);

			expect(lines).to.have.property("length").equal(1);
			expect(lines).to.be.deep.equal(validLines);

		});
		it('should throw an error for 1 and less points', () => {
			const points = [{x: 1, y: 1}];

			expect(() => Lines.mapPointsToLines(points)).to.throw("Not enought points to create line");
		});
	});

	describe('onlySingleLines', () => {
		it('should leave only lines which appeared once', () => {
			const lines = [
				[{x: 12.4, y: 13.2}, {x: 7.3,y: 3.4}],
				[{x: 12, y: 13}, {x: 7.1, y: 3 }],
				[{x: -8, y: -1}, {x: 3.2 , y: 2.2 }],
				[{x: -9, y: 13.2}, {x: -1.8,y: 13.2 }],
				[{x: -2, y: 13.3}, {x: -9.1,y: 13.3 }],
				[{x: 8, y: 1}, {x: 4.1, y: 2.1 }]
			];
			const validLines = [
				[{x: -8, y: -1}, {x: 3.2 , y: 2.2 }],
				[{x: 8, y: 1}, {x: 4.1, y: 2.1 }]
			];

			expect(Lines.onlySingleLines(lines)).to.be.deep.equal(validLines);
		});

		it('should return empty array if all lines are duplicates', () => {
			const lines = [
				[{x: 12.4, y: 13.2}, {x: 7.3,y: 3.4}],
				[{x: 12, y: 13}, {x: 7.1, y: 3 }],
				[{x: 6.6, y: 2.9}, {x: 11.9, y: 12.8}]
			];
			expect(Lines.onlySingleLines(lines)).to.have.property('length').equal(0);

		});
	});

	describe('getOutlineFromLines', () => {
		it('should compose outline from lines', () => {
			const lines = [
				[{x: 12.4, y: 13.2}, {x: 7.3,y: 3.4}],
				[{x: 8, y: 1}, {x: 4.1, y: 2.1 }],
				[{x: 11.7, y: 23}, {x: 6.9, y: 2.9}],
				[{x: -8, y: -1}, {x: 3.2 , y: 2.2 }]
			];

			const [outline, _x] =  Lines._getOutlineFromLines(lines);
			expect(outline).to.be.deep.equal([
				[{x: 12.4, y: 13.2}, {x: 7.3,y: 3.4}],
				[{x: 6.9, y: 2.9}, {x: 11.7, y: 23}]
			]);
		});
		it('should return rest lines which do not fit outline', () => {
			const lines = [
				[{x: 12.4, y: 13.2}, {x: 7.3,y: 3.4}],
				[{x: 8, y: 1}, {x: 4.1, y: 2.1 }],
				[{x: 11.7, y: 23}, {x: 6.9, y: 2.9}],
				[{x: -8, y: -1}, {x: 3.2 , y: 2.2 }]
			];

			const [_x, rest] =  Lines._getOutlineFromLines(lines);
			expect(rest).to.be.deep.equal([
				[{x: 8, y: 1}, {x: 4.1, y: 2.1 }],
				[{x: -8, y: -1}, {x: 3.2 , y: 2.2 }]
			]);
		});
	});

	describe('linesToOutlines', () => {
		it('should return correct number of outlines using all the lines', () => {
			const lines = [
				[{x: 12.4, y: 13.2}, {x: 7.3,y: 3.4}],
				[{x: 12, y: 22.8}, {x: -12, y: -7 }],
				[{x: 8, y: 1}, {x: 4.1, y: 2.1 }],
				[{x: 11.7, y: 23}, {x: 6.9, y: 2.9}],
				[{x: -8, y: -1}, {x: 3.5 , y: 2.2 }]
			];

			const outlines = Lines.linesToOutlines(lines);
			expect(outlines).to.have.property('length').equal(2);
			expect(outlines[0]).to.have.property('length').equal(3);
			expect(outlines[1]).to.have.property('length').equal(2);
		});
	});
});
