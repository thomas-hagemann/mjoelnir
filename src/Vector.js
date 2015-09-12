/**
 * Defines the coordinates of a vector.
 *
 * @author Thomas Hagemann
 * @class Vector
 */
class Vector {
	/**
	 * Constructs an instance of Vector
	 *
	 * @constructs Vector
	 * @param {Number} [x = 0] - x coordinate 
	 * @param {Number} [y = 0] - y coordinate
	 * @returns {Vector} instance of Vector 
	 */
	constructor(x = 0, y = 0) {
		return this.setCoordinates(x, y);
	}

	/*
	 * Sets the coordinates
	 *
	 * @method setCoordinates
	 * @param {Number} [x = current x value] - x coordinate 
	 * @param {Number} [y = current y value] - y coordinate 
	 * @returns {Vector} instance of Vector
	 */
	setCoordinates(x = this._x, y = this._y){
		this._x = x;
		this._y = y;
		return this;
	}

	/*
	 * Returns the x coordinates
	 *
	 * @method x
	 * @returns {Number} x - x coordinate
	 */
	get x(){
		return this._x;
	}

	/*
	 * Sets the x coordinates
	 *
	 * @method x
	 * @param {Number} [x = current x value] - x coordinate 
	 * @returns {Vector} instance of Vector
	 */
	set x(x = this._x){
		this._x = x;
		return this;
	}

	/*
	 * Returns the y coordinates
	 *
	 * @method y
	 * @returns {Number} y - y coordinate
	 */
	get y(){
		return this._y;
	}

	/*
	 * Sets the y coordinates
	 *
	 * @method y
	 * @param {Number} [y = current y value] - y coordinate 
	 * @returns {Vector} instance of Vector
	 */
	set y(y){
		this._y = y;
		return this;
	}

	/*
	 * Returns string representation of the vector
	 *
	 * @method toString
	 * @returns {String} string representation of Vector
	 */
	toString(){
		return `Vector(${this._x}/${this._y})`;
	}

	/*
	 * Returns a vector representation of the distance between
	 * this position vector and the given position vector.
	 *
	 * @method getDistanceVector
	 * @param {Vector} vector - position vector
	 * @returns {Vector} distance vector between the current and the given position vector
	 */
	getDistanceVector(vector){
		return new Vector(Math.abs(this._x - vector.x), Math.abs(this._y - vector.y));
	}

	/*
	 * Returns a vector representation of the smalles coordinates between
	 * this position vector and the given position vector.
	 *
	 * @method getMinValueVektor
	 * @param {Vector} vector - position vector
	 * @returns {Vector} vector describing the min coordinates of the current and the given position vector
	 */
	getMinValueVektor(vector){
		return new Vector(Math.min(this._x, vector.x), Math.min(this._y, vector.y));
	}
}

export {Vector}
