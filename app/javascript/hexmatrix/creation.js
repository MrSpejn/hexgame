/** @module hexmatrix/creation **/

/**
	A matrix represending a cluster of hexes, which allows ease way for finding neighbours
	@typedef HexMatrix
	@type { Hex[][] }
**/
/**
	Should create general hex matrix with specified number of rows and columns
	@param {number} nrows - number of rows in the matrix
	@param {number} ncols - number of columns in the matrix
	@param {number} start - number [0\1] indicating whether the first row should start from 0 index of from 1st
	@param {boolean} equal - value indicating whether odd and even rows should be the same length
	@return { HexMatrix }
**/
export function createGeneralHexMatrix(nrows, ncols, start, equal) {
	const hexmartix = createHexMatrix(nrows, ncols, start, equal, (row, col) => {
		return createGeneralMatrixElement(row, col);
	});
	hexmartix._meta.hexmatrixType = "general";
	return hexmartix;
}

/**
	Should create general hex matrix with specified number of rows and columns without some of the elements.
	@param {number} nrows - number of rows in the matrix
	@param {number} ncols - number of columns in the matrix
	@param {boolean[][]} occuranceMatrix - matrix indicating whether hex should be skipped or not (false - skipped)
	@param {number} start - number [0\1] indicating whether the first row should start from 0 index of from 1st
	@param {boolean} equal - value indicating whether odd and even rows should be the same length
	@return { HexMatrix }
**/
export function createCustomHexMatrix(nrows, ncols, occurance, start, equal) {
	const hexmartix = createHexMatrix(nrows, ncols, start, equal, (row, col) => {
		if (occurance[row] && occurance[row][Math.floor(col/2)]) {
			return createGeneralMatrixElement(row, col);
		}
		return null;
	});
	hexmartix._meta.hexmatrixType = "custom";
	return hexmartix;
}

/**
	Should simple hex matrix of given size. A simple hex matrix made of center element and concentric rings around it.
	Each hex inside this matrix contains information about on which circle it resides.
	@param { number } size - number of rows inside simple hex matrix
	@returns { HexMatrix }
**/
export function createSimpleHexMatrix(size) {
	if (size < 3 || size % 2 == 0) throw "Invalid size of simple hex matrix";
	const cRow = Math.floor(size / 2);
	const cCol = size - 1;


	const hexmartix = createHexMatrix(size, size, cRow % 2, false, (row, col) => {
		const fromCentral = Math.abs(row - cRow);
		const rowSize = (size - fromCentral);

		if (col < fromCentral || col >= fromCentral + 2 * rowSize) return null;
		return createSimpleMatrixElement(row, col, cRow, cCol);
	});

	hexmartix._meta.hexmatrixType = "simple";
	return hexmartix;
}


/**
	Function which base on row and column index whether to insert hex and if then what kind of hex it should be
	@callback createHexMatrix-createFunction
	@param {number} row
	@param {number} column

**/
/**
	Allows creating any kind of hex matrix throught createFn allowing to skip or create any element at given index
	@param {number} nrows - number of rows in the matrix
	@param {number} ncols - number of columns in the matrix
	@param {number} start - number [0|1] indicating whether the first row should start from 0 index of from 1st
	@param {boolean} equal - value indicating whether odd and even rows should be the same length
	@param {createHexMatrix-createFunction} createFn - function which base on row and column index whether to insert hex and if then what kind of hex it should be
	@return { HexMatrix }
**/
function createHexMatrix(nrows, ncols, start = 0, equal = true, createFn) {
	const matrix = [];
	for (let row = 0; row < nrows; row++) {
		matrix.push([]);
		for (let col = 0; col < 2*ncols - 1 + equal; col++) {
			if (row % 2 != col % 2) {
				matrix[row][col] = start ? createFn(row, col) : null;
			} else {
				matrix[row][col] = start ? null : createFn(row, col);
			}
		}
	}
	matrix._meta = {};
	return matrix;
}
/**
	Creates general matrix element
	@param { number } row
	@param { number } col
	@return { Hex }
**/
function createGeneralMatrixElement(row, col) {
	return { row, col };
}

/**
	Creates simple matrix element - general matrix element with additional information about circle it resides in.
	@param { number } row
	@param { number } col
	@param { number } centerRow
	@param { number } centerCol
	@return { Hex }
**/
function createSimpleMatrixElement(row, col, cRow, cCol) {
	return {
		...createGeneralMatrixElement(row, col),
		circle: calculateElementCircle(row, col, cRow, cCol)
	};
}

/**
	Returns circle of the hex for given hex and center indices
	@param { number } row
	@param { number } col
	@param { number } centerRow
	@param { number } centerCol
	@return { number }
**/
function calculateElementCircle(row, col, cRow, cCol) {
	return Math.max(
		Math.floor((Math.abs(cCol - col) + Math.abs(cRow - row)) / 2),
		Math.abs(cRow - row)
	);
}

export let _calculateElementCircle;

if (process && process.env.testing) {
	_calculateElementCircle = calculateElementCircle;
}
