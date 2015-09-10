class Point {
	constructor(x = 0, y = 0) {
		return this.setCoordinates(x, y);
	}

	setCoordinates(x = this._x, y = this._y){
		this._x = x;
		this._y = y;
		return this;
	}

	get x(){
		return this._x;
	}

	set x(x){
		this._x = x;
		return this;
	}

	get y(){
		return this._y;
	}

	set y(y){
		this._y = y;
		return this;
	}

	toString(){
		return `Point(${this._x}/${this._y})`;
	}

	clone(){
		return new Point(this._x, this._y);
	}

	getDifference(comparePoint){
		return new Point(Math.abs(this._x - comparePoint.x), Math.abs(this._y - comparePoint.y));
	}

	getMinValuePoint(comparePoint){
		return new Point(Math.min(this._x, comparePoint.x), Math.min(this._y, comparePoint.y));
	}
}

export {Point}
