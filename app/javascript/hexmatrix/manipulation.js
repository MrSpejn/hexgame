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
	Initializes hexlist with content and metadata
	@class
	@classdesc It contains list of hexes with metadata and at the same time allows to use common array methods
**/
export function HexList(content, meta) {
	this._meta = meta;
	this.content = content;
}
/**
	Return new HexList with hexes from the original list for which fn return true
	@param { function } fn - function deciding whether to keep hex or not
	@return { HexList } - new HexList containing the same metadata
**/
HexList.prototype.filter = function(fn) {
	return new HexList(this.content.filter(fn), this._meta);
};
/**
	Reduces HexList to a single value by applying passed function to each hex
	@param { function } fn - function returning acculator for each hex
	@return { Any } - value to which HexList was reduced to
**/
HexList.prototype.reduce = function(fn, init) {
	return this.content.reduce(fn, init);
};
/**
	Return new HexList created by applying a function to each hex of the original HexList
	and adding the result of it to the list.
	@param { function } fn - function mapping original values to new
	@return { HexList }
**/
HexList.prototype.map = function(fn) {
	return new HexList(this.content.map(fn), this._meta);
};
/**
	Return standard array created by applying a function to each hex of the original HexList
	and adding the result of it to the array.
	@param { function } fn - function mapping original values to new
	@return { Any[] }
**/

HexList.prototype.mapNative = function(fn) {
	return this.content.map(fn);
};
/**
	Executes passed function on each hex in the HexList
	@param { function } fn - function to execute
**/
HexList.prototype.forEach = function(fn) {
	this.content.forEach(fn);
};
/**
	Return metadata of the list
	@return { Object } - metadata
**/
HexList.prototype.getMeta = function() {
	return this._meta;
};
/**
	Return hex at the passed index
	@return { number } - index
	@return { Hex } - hex
**/
HexList.prototype.get = function(i) {
	return this.content[i];
};
/**
	Returns HexList length
	@return { number } - length
**/
HexList.prototype.length = function() {
	return this.content.length;
};
/**
	Should convert hexmatrix into the HexList
	@param { HexMatrix }
	@return { HexList }
**/
export function hexMatrixToList(hexmatrix) {
	const content = _.flatten(hexmatrix.map(row => row.filter(hex => !!hex)));
	return new HexList(content, hexmatrix._meta);
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
	if (simpleHexMatrix._meta.hexmatrixType !== "simple") throw "Only simple matrix have circles";
	return simpleHexMatrix
		.reduce((list, row) => [...list, ...row], [])
		.filter(hex => !!hex)
		.filter(hex => alsoLower ? hex.circle <= circle : hex.circle == circle);
}
