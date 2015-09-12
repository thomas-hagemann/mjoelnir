import {Vector} from "./Vector";

/**
 * Defines an area where intersecting objects are 
 * marked.
 *
 * @author Thomas Hagemann
 * @class SelectionArea
 */
class SelectionArea {
	/**
	 * Constructs an instance of SelectionArea
	 *
	 * @constructs SelectionArea
	 * @param {String} [parent = "selectionGroup"] - class name of the parent element contaning all selectable elements
	 * @param {String} [id = parent+"Overlay"] - id of the overlay. The visual feedback of the area where elements will be marked. 
	 * @param {String} [css = "background:rgba(51,153,255,0.4); border:1px solid rgb(51,153,255);"] - css for the overlay 
	 * @returns {SelectionArea} instance of SelectionArea
	 */
	constructor(parent = "selectionGroup", id = parent+"Overlay", css = "background:rgba(51,153,255,0.4); border:1px solid rgb(51,153,255);") {
		this.id = id;
		this.parent = parent;

		// starting point for the selection area. On mouse movement the overlay will pivot around this point
		this._pivotPoint = new Vector(0, 0);
		// current mouse position and always the opposite coner to the pivot point
		this._currentPosition = new Vector(0, 0);

		// add style to page head
		const style = document.createElement("style");
		style.innerHTML = 	`#${id} {
			${css}
		}`;
		document.head.insertBefore(style, document.head.firstChild);

		// add a div representing the overlay to the parent element
		document.querySelector("."+this.parent).innerHTML
			+= `<div id="${this.id}" style="display: none; position: absolute;"></div>`;
		this._domRef = document.getElementById(this.id);

		return this;
	}

	/*
	 * Sets the pivot point of the selection area. And displays the visual feedback i.e. the overlay.
	 *
	 * @method setPivot
	 * @param {Number} [x = 0] - x coordinate of the pivot point
	 * @param {Number} [y = 0] - y coordinate of the pivot point
	 * @returns {SelectionArea} instance of SelectionArea
	 */
	setPivot(x = 0, y = 0){
		this._pivotPoint.setCoordinates(x, y);
		this._setStyleDimensions(0, 0, y, x).show();

		return this;
	}

	/*
	 * Updates the visual feedback of the selection area, by setting the dimensions.
	 *
	 * @method updateDimensions
	 * @param {Number} [x = 0] - x coordinate of the pivot point
	 * @param {Number} [y = 0] - y coordinate of the pivot point
	 * @returns {SelectionArea} instance of SelectionArea
	 */
	updateDimensions(x = 0, y = 0){
		this._currentPosition.setCoordinates(x, y);
		const minValue = this._currentPosition.getMinValueVektor(this._pivotPoint);
		const difference = this._currentPosition.getDistanceVector(this._pivotPoint);
		this._setStyleDimensions(difference.x, difference.y, minValue.y, minValue.x+difference.x, minValue.y+difference.y, minValue.x);

		return this;
	}

	/*
	 * Sets the dimensions of the acctual dom element, by steting its style definitions for
	 * width, height, top, right, bottom, left.
	 *
	 * @method _setStyleDimensions
	 * @param {Number} [width = 0] - width of the selection area
	 * @param {Number} [heigh = 0] - heigh of the selection area
	 * @param {Number} [top = 0] - top position of the selection area
	 * @param {Number} [right = 0] - right position of the selection area
	 * @param {Number} [bottom = 0] - bottom position of the selection area
	 * @param {Number} [left = 0] - left position of the selection area
	 * @returns {SelectionArea} instance of SelectionArea
	 */
	_setStyleDimensions(width = 0, heigh = 0, top = 0, right = 0, bottom = 0, left = 0){
		this._domRef.style.width = width+"px";
		this._domRef.style.height = heigh+"px";
		this._domRef.style.top = top+"px";
		this._domRef.style.right = right+"px";
		this._domRef.style.bottom = bottom+"px";
		this._domRef.style.left = left+"px";

		return this;
	}

	/*
	 * Analyses if a object and the selection area intersect.
	 *
	 * @method intersectsWith
	 * @param {Ojbect} object - to run the check aganst 
	 * @returns {Boolean} true if the given object and the selection area intersect, otherwith false 
	 */
	intersectsWith(object){
		return object.getBoundingClientRect().right > parseFloat(this._domRef.style.left)
			&& parseFloat(this._domRef.style.right) > object.getBoundingClientRect().left
			&& object.getBoundingClientRect().bottom > parseFloat(this._domRef.style.top)
			&& parseFloat(this._domRef.style.bottom) > object.getBoundingClientRect().top;
	}

	/*
	 * Analyses if the selection area is bigger than a given width and height.
	 *
	 * @method isBigerThan
	 * @param {Number} [width = 5] - width of the selection area
	 * @param {Number} [heigh = 5] - heigh of the selection area
	 * @returns {Boolean} true if the selection area is bigger than a given width and height
	 */
	isBigerThan(width = 5, height = 5){
		const difference = this._currentPosition.getDistanceVector(this._pivotPoint);
		return difference.x > width || difference.y > height;
	}

	/*
	 * Sets the display type of the dom element represtening the selection area to block. 
	 * So to show a visual feedback.
	 *
	 * @method show
	 * @returns {SelectionArea} instance of SelectionArea
	 */
	show(){
		this._domRef.style.display = 'block';
		
		return this;
	}


	/*
	 * Sets the display type of the dom element represtening the selection area to none. 
	 * So to hide the overlay.
	 *
	 * @method hide
	 * @returns {SelectionArea} instance of SelectionArea
	 */
	hide(){
		this._domRef.style.display = 'none';
		
		return this;
	}

	/*
	 * Analyses if the selection area is shown.
	 *
	 * @method isVisible
	 * @returns {Boolean} true if the selection area is visible
	 */
	isVisible(){
		// visibility test against not none so other disply types than block could be possible
		return this._domRef.style.display != 'none';
	}
}

export {SelectionArea}
