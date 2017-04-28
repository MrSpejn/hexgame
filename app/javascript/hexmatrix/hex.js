
/** @module hexmatrix/hex **/
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

/** @type {number[][]} **/
/**  Array of neighbours' indices relative to hex indices **/
const adjacent = [[-1, -1], [1, -1], [1, 1], [-1, 1], [0, 2], [0, -2]];

/**
	Should return absolute indices of hexes adjacent to hex coordiates
	@param { HexMatrix } hexmatrix - hexmartix to which hex belong
	@param { Indieces } indices - indices of hex for which adjacent are looked up
	@return { Indieces[] } Absolute indices of hexes adjacent to hex coordiates
**/
export function getAdjacent(hexmatrix, [row, col]) {
	const size = hexmatrix.length;
	const potencials = adjacent.map(([dr, dc]) => [dr + row, dc + col]);
	return potencials.filter(indices => doesHexExist(hexmatrix, indices));
}

/**
	Should return absolute indices of hexes surrounding to hex coordiates
	@param { HexMatrix } hexmatrix - hexmartix to which hex belong
	@param { Indieces } indices - indices of hex for which neighbours are looked up
	@param { number } level - distance between neighbour and hex
	@param { boolean} andLower - flag indicating whether closer neighbours also should be included
	@return { Indieces[] } Absolute indices of hexes surrounding to hex coordiates

**/
export function getSurrounding(hexmatrix, [row, col], level = 1, andLower = false) {
	if (!doesHexExist(hexmatrix, [row, col])) throw `Invalid indices: ${row}, ${col}`;
	const origin = hexmatrix[row][col];
	const minRow = Math.max(row - level, 0);
	const minCol = Math.max(col - (level *2),0);
	return hexmatrix
		.slice(minRow, row + level + 1)
		.reduce((list, matrow) => [...list, ...matrow.slice(minCol, col + 2*level+1)], [])
		.filter(hex => !!hex)
		.filter(hex => {
			if(andLower) return distanceBetween(origin, hex) <= level;
			else return distanceBetween(origin, hex) == level;
		});
}

/**
	Check whether there is a hex object under given coordiates in  hexmatrix
	@param { HexMatrix } hexmatrix
	@param { Indieces } indices
	@return { boolean } Whether there is a hex object under given coordiates in hexmatrix
**/
export function doesHexExist(hexmatrix, [row, col]) {
	return !!hexmatrix[row] && !!hexmatrix[row][col];
}

/**
	Calculate distance ( in number of hexes ) between two hexes.
	@param { Hex } hex1
	@param { Hex } hex2
	@return { number} Distance between hexes
**/
export function distanceBetween({ row:row1, col:col1 }, { row:row2, col:col2 }) {
	return Math.max(
		Math.floor((Math.abs(col2 - col1) + Math.abs(row2 - row1)) / 2),
		Math.abs(row2 - row1)
	);
}
/**
	Check whether hex has an adjecent hex inside an array
	@param { Hex } hex
	@param { Hex[] } set - array of hexes
	@return { boolean } Whether hex has an adjecent hex inside an array
**/
export function haveInSetAdjacent(hex, set) {
	return set.some(el => areAdjacent(el, hex));
}

/**
	Checks whether hexes are adjecent to each other
	@param { Hex } hex1
	@param { Hex } hex2
	@return { boolean } Whether hexes are adjecent to each other
**/
export function areAdjacent(hex1, hex2) {
	const horiDist = Math.abs(hex1.col - hex2.col);
	const vertDist = Math.abs(hex1.row - hex2.row);
	return !(hex1.col == hex2.col && hex1.row == hex2.row) && horiDist <= 2 && vertDist <= 1;
}
