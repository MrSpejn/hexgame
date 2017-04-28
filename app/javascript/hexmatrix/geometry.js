import { pointsToSVGPolygonString } from "../geom/point";
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
	@param { HexMatrix } hexmatrix - matrix to extend
	@param { number } size - size of the single hex in 2D
	@return { HexMatrix } HexMatrix with element extended with 2D Geometry informations
**/
export function extendHexMatrixWithGeometry(hexmatrix, size) {
	const width = size * Math.sqrt(3) / 2;
	const height = size;
	const vertexModel = generateVertexModel(width, height);
	return hexmatrix.map(row => row.map(hex => {
		return hex ? extendWith2DCoordinates(hex, width, height, vertexModel) : null;
	}));
}

/**
	Extends single hex with information about 2D Geometry
	@param { Hex } hex - hex to extend
	@param { number } width - hex width in 2D
	@param { number } height - hex height in 2D
	@param { Coords[] } vertexModel - vertices position relative to hex center
	@return { Hex } Hex extended with information about 2D Geometry
**/
function extendWith2DCoordinates(hex, width, height, vertexModel) {
	const center = find2DCenterCoordinates(hex, width, height);
	const vertices = calculateVertexModel(vertexModel, center);
	return { ...hex, center, vertices, asString: pointsToSVGPolygonString(vertices) };
}

/**
	Return center of hex for given hex width and height
	@param { Hex } hex - hex for which center is to be found
	@param { number } width - hex width
	@param { number } height - hex height
	@return { Object } Coordiates of hex center
**/
function find2DCenterCoordinates({ row, col }, width, height) {
	return {
		x: (1 + col) * width / 2,
		y: ((2/3) + row) * height /4*3
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

export let _find2DCenterCoordinates;
export let _extendWith2DCoordinates;
export let _generateVertexModel;


if (process && process.env.testing) {
	_find2DCenterCoordinates = find2DCenterCoordinates;
	_extendWith2DCoordinates = extendWith2DCoordinates;
	_generateVertexModel = generateVertexModel;
}
