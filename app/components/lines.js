import { pointToString } from "./point";
/** @module lines */

/**
	Array of two Object representing two ends of the line
	@typedef Line
	@type { Point[] }
**/

/** @type {number} **/
/**  Module global accuracy **/
const accuracy = 4;

/**
	Create an array of outlines which are the array of lines sorted in a way
	where each subsequent line starts where the previous line ended.
	@param { Line[] } lines
	@return { Line[][] }
**/
export function linesToOutlines(initialLines) {
	let lines = initialLines;
	let outlines = [];
	while (lines.length > 0) {
		const [outline, rest] = getOutlineFromLines(lines);
		lines = rest;
		outlines = [...outlines, outline];
	}
	return outlines;
}

/**
	Starting from the first element function tries to build an outline. Return and array
	where first element is an array of lines creating an outline,
	and the second one is an array of lines which do not fit the outline.
	@param { Line[] } lines
	@return { Line[][] }
**/

function getOutlineFromLines(lines) {
	let [head, ...tail] = lines;
	let result = [ head ];
	while (tail.length) {
		let connection;
		let connIdx;
		for (let i = 0; i < tail.length; i++) {
			connection = indexOf(tail[i], head[1]);
			connIdx = i;
			if (connection != -1) break;
		}
		if (connection == -1) break;
		else if (connection == 0) head = tail[connIdx];
		else head = turnAround(tail[connIdx]);

		tail = [...tail.slice(0, connIdx), ...tail.slice(connIdx+1)];
		result = [...result, head];
	}
	return [result, tail];
}

/**
	Returns only those line which appeared in the array once.
	@param { Line[] } lines
	@return { Line[] }
**/
export function onlySingleLines(lines) {
	let head = lines[0];
	let tail = lines.slice(1);
	let result = [];
	while (tail.length > 0) {
		const newTail = tail.filter(l => !linesEqual(l, head));
		if (newTail.length === tail.length) {
			result = [ ...result, head];
		}
		head = newTail[0];
		tail = newTail.slice(1);
	}
	if (head) {
		result = [...result, head];
	}
	return result;
}


/**
	Joins subsequent points in the array of points creating a array of lines.
	@param { Point[] } points
	@return { Line[] }
**/
export function mapPointsToLines(points) {
	return points.map((p, i) => [p, points[(i+1)%points.length]]);
}


/**
	Swaps points inside an line
	@param { Line } line
	@return { Line }
**/
export function turnAround([p1, p2]) {
	return [p2, p1];
}

/**
	Checks whether two lines are equal with global module accuracy.
	@param { Line } line1
	@param { Line } line2
	@return { boolean }
**/
export function linesEqual([p1, p2], [p3, p4]) {
	return (( distSquared(p1, p4) < accuracy && distSquared(p2, p3) < accuracy ) ||
			( distSquared(p1, p3) < accuracy && distSquared(p2, p4) < accuracy ));
}

/**
	Converts array of lines into SVG path string.
	@param { Line[] } lines - an array of lines to convert
	@return { string }
**/
export function linesToPathString(lines) {
	const pointsOfInterest = lines.map(l => pointToString(l[0]));
	return `M ${pointsOfInterest.join(" L ")} Z`;
}

/**
	Returns index of point [0 | 1] in line if point is an end of line
	with global module accuracy otherwise return -1.
	@param {Line} line - line that could end with given point
	@param {Point} point - point looked for in line
	@return {number}
**/
function indexOf([p1, p2], point) {
	if (distSquared(point, p1) < accuracy) return 0;
	if (distSquared(point, p2) < accuracy) return 1;
	return -1;
}



/**
	Returns square distance between points.
	@param { Point } p1
	@param { Point } p2
	@return { number }
**/
function distSquared({x:x1, y:y1}, {x:x2, y:y2}) {
	return (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2);
}
