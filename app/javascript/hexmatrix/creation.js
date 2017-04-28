export function createGeneralHexMatrix(nrows, ncols, start, equal) {
	const hexmartix = createHexMatrix(nrows, ncols, start, equal, (row, col) => {
		return createGeneralMatrixElement(row, col);
	});
	hexmartix._hexmatrixType = 'general';
	return hexmartix;
}

export function createCustomHexMatrix(nrows, ncols, occurance, start, equal) {
	const hexmartix = createHexMatrix(nrows, ncols, start, equal, (row, col) => {
		if (occurance[row] && occurance[row][Math.floor(col/2)]) {
			return createGeneralMatrixElement(row, col);
		}
		return null;
	});
	hexmartix._hexmatrixType = 'custom';
	return hexmartix;
}

export function createSimpleHexMatrix(size) {
	if (size < 3 || size % 2 == 0) throw 'Invalid size of simple hex matrix';
	const cRow = Math.floor(size / 2);
	const cCol = size - 1;


	const hexmartix = createHexMatrix(size, size, cRow % 2, false, (row, col) => {
		const fromCentral = Math.abs(row - cRow);
		const rowSize = (size - fromCentral);

		if (col < fromCentral || col >= fromCentral + 2 * rowSize) return null;
		return createSimpleMatrixElement(row, col, cRow, cCol);
	});

	hexmartix._hexmatrixType = 'simple';
	return hexmartix;
}


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
	return matrix;
}

function createGeneralMatrixElement(row, col) {
	return {
		row,
		col
	};
}

function createSimpleMatrixElement(row, col, cRow, cCol) {
	return {
		...createGeneralMatrixElement(row, col),
		circle: calculateElementCircle(row, col, cRow, cCol)
	};
}

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
