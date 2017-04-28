import _ from "lodash";

/** @module hexmatrix/manipulation **/
/**
	A matrix represending a cluster of hexes, which allows ease way for finding neighbours
	@typedef HexMatrix
	@type { Hex[][] }
**/
/**
	Array represending position in matrix
	@typedef Indieces
	@type { number[] }
**/

/**
	Should convert hexmatrix into the list of hexes
	@param { HexMatrix }
	@return { Hex[] } List of hexes
**/
export function hexMatrixToList(hexmartix) {
	return _.flatten(hexmartix.map(row => row.filter(hex => !!hex)));
}

/**
	Get list of hexes under the specified indices from hexmatrix
	@param { HexMatrix }
	@param { Indieces[] }
	@return { Hex[] } List of hexes under the specified indices from hexmatrix
**/
export function getSet(hexmatrix, listOfIndices) {
	return listOfIndices.map(([row, col]) => {
		if (!hexmatrix[row] || !hexmatrix[row][col]) throw "Invalid indices";
		return hexmatrix[row][col];
	});
}

/**
	Get list of hexes residing on given circle and optionally lower from simple hexmatrix
	@param { HexMatrix } simpleHexMatrix
	@param { number } circle
	@param { boolean} alsoLower - flag indicating whether also get hexes from lower circles
	@return { Hex[] } List of hexes residing on given circle
**/
export function getCircle(simpleHexMatrix, circle, alsoLower = false) {
	if (simpleHexMatrix._hexmatrixType !== "simple") throw "Only simple matrix have circles";
	return simpleHexMatrix
		.reduce((list, row) => [...list, ...row], [])
		.filter(hex => !!hex)
		.filter(hex => alsoLower ? hex.circle <= circle : hex.circle == circle);
}
