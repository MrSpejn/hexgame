/** @module point */


/**
	Object representing a point in 2 dimentions.
	@typedef Point
	@type {Object}
	@property {number} x - a x coordinate.
	@property {number} y - an y coordinate.
 **/

/**
	Returns a string represending the point where coordinates have been rounded
	and separated by custom delimeter.
	@param { Point } point
	@param { string } delimeter - custom delimeter (default: " ")
	@return { string }
**/

export function pointToString(point, delimeter = " ") {
	return Math.round(point.x) + delimeter + Math.round(point.y);
}

/**
	Returns SVG Polygon element string created from array of points
	@param { Point[] } points
	@return { string }
**/
export function pointsToSVGPolygonString(points) {
	return points.map(point => pointToString(point, ",")).join(" ");
}

/**
	Returns SVG Path element string created from array of points
	@param { Point[] } points
	@return { string }
**/
export function pointsToSVGPathString(points) {
	return "M " + points.map(point => pointToString(point, " ")).join(" L ") + " Z";
}
