
class SelectionArea {

	constructor(configuration = {}) {
		this.id = configuration.id;
		this.parent = configuration.parent;
		this.pivotPoint = configuration.pivotPoint;
		this.currentPosition = configuration.currentPosition;
		this.html = configuration.html;
		this.domRef = configuration.domRef;
	}

	appendToDom(){
		document.querySelector("."+this.parent).innerHTML += this.html;
		this.domRef = document.getElementById(this.id);
	}

	setPivot(point){
		this.pivotPoint.setCoordinates(point.x, point.y);
		this.domRef.style.width = '0px';
		this.domRef.style.height = '0px';
		this.domRef.style.left = point.x+'px';
		this.domRef.style.top = point.y+'px';
		this.domRef.style.display = 'block';
	}

	updateDimensions(point){
		this.currentPosition.setCoordinates(point.x, point.y);
		let minValue = this.currentPosition.getMinValuePoint(this.pivotPoint);
		let difference = this.currentPosition.getDifference(this.pivotPoint);
		this.domRef.style.top = minValue.y+"px";
		this.domRef.style.left = minValue.x+"px";
		this.domRef.style.width = difference.x+"px";
		this.domRef.style.height = difference.y+"px";
		this.domRef.style.bottom = minValue.y+difference.y+"px";
		this.domRef.style.right = minValue.x+difference.x+"px";
	}

	intersectsWith(object){
		return object.getBoundingClientRect().right > parseFloat(this.domRef.style.left)
			&& parseFloat(this.domRef.style.right) > object.getBoundingClientRect().left
			&& object.getBoundingClientRect().bottom > parseFloat(this.domRef.style.top)
			&& parseFloat(this.domRef.style.bottom) > object.getBoundingClientRect().top;
	}

	isBigerThan(width = 5, height = 5){
		let difference = this.currentPosition.getDifference(this.pivotPoint);
		return difference.x > width || difference.y > height;
	}

	hide(){
		this.domRef.style.display = 'none';
	}

	isVisible(){
		return this.domRef.style.display != 'none';
	}
}

export {SelectionArea}
