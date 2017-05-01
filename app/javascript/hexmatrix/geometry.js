import { pointsToSVGPathString } from "../geom/point";
import { mapPointsToLines, distSquared } from "../geom/lines";

/** @module hexmatrix/geometry **/

/**
	A matrix represending a cluster of hexes, which allows ease way for finding neighbours
	@typedef HexMatrix
	@type { Hex[][] }
**/

/**
	Coordinates
	@typedef Coords
	@type { Object }
**/

/**
	Extends hexes inside hex matrix with information about 2D Geometry ( center, vetices, ...)
	It also allows specifing padding (distance between end of one hex and start of another) and
	margin (distance between plain edges and hexes). Should also add meta data to matrix
	containing plain size, and parameter values used to generating geometry.
	@param { HexMatrix } hexmatrix - matrix to extend
	@param { number } size - size of the single hex in 2D
	@return { HexMatrix } HexMatrix with element extended with 2D Geometry informations
**/
export function extendHexMatrixWithGeometry(hexmatrix, size, {padding, margin} = {padding:0, margin:0}){
	const width = size * Math.sqrt(3) / 2;
	const height = size;
	const ncol = hexmatrix.length*2-1;
	const nrow = hexmatrix.length;
	const vertexModel = generateVertexModel(width, height);
	const extended = hexmatrix.map(row => row.map(hex => {
		if(hex) {
			return extendWith2DCoordinates(hex, width, height, vertexModel, {padding, margin});
		}
		return null;
	}));

	extended._meta = { ...hexmatrix._meta };
	extended._meta.geom = true;
	extended._meta.geometry = {
		width: (1 + 0.5*(ncol-1)) * width + margin*2 + ncol*padding,
		height: (1 + 0.75*(nrow-1)) * height + margin*2 + nrow*padding,
		size,
		margin,
		padding
	};
	return extended;
}

/**
	Extends single hex with information about 2D Geometry (center, vertices, lines)
	@param { Hex } hex - hex to extend
	@param { number } width - hex width in 2D
	@param { number } height - hex height in 2D
	@param { Coords[] } vertexModel - vertices position relative to hex center
	@return { Hex } Hex extended with information about 2D Geometry
**/
function extendWith2DCoordinates(hex, width, height, vertexModel, {padding, margin} = {padding:0, margin:0}) {
	const center = find2DCenterCoordinates(hex, width, height, {padding, margin});
	const vertices = calculateVertexModel(vertexModel, center);
	const lines = mapPointsToLines(vertices);
	return { ...hex, center, vertices, lines, asString: pointsToSVGPathString(vertices) };
}

/**
	Return center of hex for given hex width and height
	@param { Hex } hex - hex for which center is to be found
	@param { number } width - hex width
	@param { number } height - hex height
	@return { Object } Coordiates of hex center
**/
function find2DCenterCoordinates({ row, col }, width, height, {padding, margin} = {padding:0, margin:0}) {
	return {
		x: (1 + col) * width / 2 + margin + padding * col,
		y: ((2/3) + row) * height /4*3 + margin + padding * row
	};
}

/**
	Returns vertex model for given hex width and height - vertices coordinates relative to center
	@param { number } width - hex width
	@param { number } height - hex height
	@return { Coords[] } Vertices coordinates relative to center
**/
function generateVertexModel(width, height) {
	return [
		{ x: -width/2, y: -height/4 }, { x: 0, y: -height/2 },
		{ x: width/2, y: -height/4 }, { x: width/2, y: height/4 },
		{ x: 0, y: height/2 }, { x: -width/2, y: height/4 }
	];
}

/**
	Returns absolute coordinates for given vertex model and center coordinates
	@param { Coords[] } vmodel - vertex model
	@param { Object } center - object containing x and y coordinates of hex center
	@return { Coords[] } Absolute coordinates for given center
**/
function calculateVertexModel(model, {x, y}) {
	return model.map(vertex => ({
		x: vertex.x + x,
		y: vertex.y + y
	}));
}

/**
	Returns hextiles from the list associated with given coordinates or null if no
	such hextile was found.
	@param { Hex[] } hexes - list of hexes where hex is looked for
	@param { number } x - x coordinate
	@param { number } y - y coordinate
	@return { Hex|null } - hex on given coordinates or null if there is none
**/
export function detectTile(hexes, x, y) {
	const { size } = hexes._meta.geometry;
	const height = size / 2;
	const width = size * Math.sqrt(3) / 4;

	return hexes
	.filter(hex => {
		const { x:cx, y:cy } = hex.center;
		return x >= (cx - (width + 5)) && x <= (cx + (width + 5)) &&
				y > (cy - (height + 5)) && y <= (cy + (height + 5)) && !hex._props.disabled;
	})
	.reduce((closest, hex) => {
		if (!closest) return hex;
		if (distSquared(hex.center, {x, y}) < distSquared(closest.center, {x, y}))
			return hex;
		return closest;
	} , null);
}

export let _find2DCenterCoordinates;
export let _extendWith2DCoordinates;
export let _generateVertexModel;


if (process && process.env.testing) {
	_find2DCenterCoordinates = find2DCenterCoordinates;
	_extendWith2DCoordinates = extendWith2DCoordinates;
	_generateVertexModel = generateVertexModel;
}
