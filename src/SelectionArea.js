import {Point} from "./Point";

class SelectionArea {

	constructor(parent = "selectionGroup", id = parent+"Overlay", css = "background:rgba(51,153,255,0.4); border:1px solid rgb(51,153,255);") {
		this.id = id;
		this.parent = parent;

		this._pivotPoint = new Point(0, 0);
		this._currentPosition = new Point(0, 0);

		const style = document.createElement("style");
		style.innerHTML = 	`#${id} {
			${css}
		}`;
		document.head.insertBefore(style, document.head.firstChild);

		document.querySelector("."+this.parent).innerHTML
			+= `<div id="${this.id}" style="display: none; position: absolute;"></div>`;
		this._domRef = document.getElementById(this.id);
	}

	setPivot(x = 0, y = 0){
		this._pivotPoint.setCoordinates(x, y);
		this._domRef.style.width = '0px';
		this._domRef.style.height = '0px';
		this._domRef.style.left = x+'px';
		this._domRef.style.top = y+'px';
		this._domRef.style.display = 'block';
	}

	updateDimensions(x = 0, y = 0){
		this._currentPosition.setCoordinates(x, y);
		const minValue = this._currentPosition.getMinValuePoint(this._pivotPoint);
		const difference = this._currentPosition.getDifference(this._pivotPoint);
		this._domRef.style.top = minValue.y+"px";
		this._domRef.style.left = minValue.x+"px";
		this._domRef.style.width = difference.x+"px";
		this._domRef.style.height = difference.y+"px";
		this._domRef.style.bottom = minValue.y+difference.y+"px";
		this._domRef.style.right = minValue.x+difference.x+"px";
	}

	intersectsWith(object){
		return object.getBoundingClientRect().right > parseFloat(this._domRef.style.left)
			&& parseFloat(this._domRef.style.right) > object.getBoundingClientRect().left
			&& object.getBoundingClientRect().bottom > parseFloat(this._domRef.style.top)
			&& parseFloat(this._domRef.style.bottom) > object.getBoundingClientRect().top;
	}

	isBigerThan(width = 5, height = 5){
		const difference = this._currentPosition.getDifference(this._pivotPoint);
		return difference.x > width || difference.y > height;
	}

	hide(){
		this._domRef.style.display = 'none';
	}

	isVisible(){
		return this._domRef.style.display != 'none';
	}
}

export {SelectionArea}
