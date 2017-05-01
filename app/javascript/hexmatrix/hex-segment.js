import _ from "lodash";
import { linesToOutlines, onlySingleLines } from "../geom/lines";
import { haveInSetAdjacent } from "./hex";
/** @module hexmatrix/hex-segment **/

/**
	A matrix represending a cluster of hexes, which allows ease way for finding neighbours.
	@typedef HexMatrix
	@type { Hex[][] }
**/

/**
	An array of hexes where each segment is connected to others through line of
	other in array hexes.
	@typedef HexSegment
	@type { Hex[] }
**/


/**
	Check whether an array of hexes is a valid hex segment.
	@param { HexMatrix } hexmatrix - matrix from which array of hexes is taken
	@param { Hex[] } set - array of hexes to check
	@return { boolean } Whether an array of hexes is a valid hex segment.
**/
export function isSetValidSegment(hexmatrix, set) {
	if (!set.every(hex => haveInSetAdjacent(hex, set))) return false;
	return true;
}

/**
	Return an array of outlines associated with a segment. Outlines should be sorted from shortest to longest
	@param { HexMartix } hexmatrix - matrix from which segment is taken
	@param { HexSegment } segment - segment of hexes
	@param { boolean } checkValidity - flag indicating whether segment should be check for validity before calculating outlines
	@return { Line[][] } Array of outlines associated with a segment.
**/
export function getSegmentOutlines(hexmatrix, segment, checkValidity = true) {
	if (checkValidity && !isSetValidSegment(hexmatrix, segment))
		throw "Invalid segment";

	const lines = _.flatten(segment.map(hex => hex.lines));
	return _.sortBy(linesToOutlines(onlySingleLines(lines)), "length");
}
