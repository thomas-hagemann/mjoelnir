import {Point} from "./Point";

var forEach = Array.prototype.forEach;

	class MultiSelection {

	constructor(configuration = {}) {
		this._config = {
			"markedClass": "marked",
			"selectedClass": "selected",
			"inSelectionClass": "inSelection"
		};
		this.overlay = {
			"id": "mouseOverlay",
			"parent": "searchArea",
			"startPosition": new Point(0, 0),
			"currentPosition": new Point(0, 0),
			"html": `<div id="mouseOverlay" style="display: none;"></div>`,
			"domRef": null
		};
		// append overlay
		document.querySelector("."+this.overlay.parent).innerHTML += this.overlay.html;
		this.overlay.domRef = document.getElementById(this.overlay.id);

		this.addMouseDownEventListener();
		this.addMouseUpEventListener();
		this.addMouseMoveEventListener();
	}

	_showOverlay(point){
		this.overlay.startPosition.setCoordinates(point.x, point.y);
		this.overlay.domRef.style.width = '0px';
		this.overlay.domRef.style.height = '0px';
		this.overlay.domRef.style.left = point.x+'px';
		this.overlay.domRef.style.top = point.y+'px';
		this.overlay.domRef.style.display = 'block';
	}

	intersectWithSelection(object){
		var element = {
			'top': object.getBoundingClientRect().top,
			'left': object.getBoundingClientRect().left,
			'width': object.getBoundingClientRect().width,
			'height': object.getBoundingClientRect().height,
			'bottom': object.getBoundingClientRect().bottom,
			'right': object.getBoundingClientRect().right
		};
		var selection = this.getMouseOverlay();
		return element.right > selection.left && selection.right > element.left &&
		element.bottom > selection.top && selection.bottom > element.top;
	}

	getMouseOverlay(){
		let minValue = this.overlay.currentPosition.getMinValuePoint(this.overlay.startPosition);
		let difference = this.overlay.currentPosition.getDifference(this.overlay.startPosition);
		return {
			'top': minValue.y,
			'left': minValue.x,
			'width': difference.x,
			'height': difference.y,
			'bottom': minValue.y+difference.y,
			'right': minValue.x+difference.x
		};
	}

	isOverlayBiggerThanMinSize(minSize = 10){
		let difference = this.overlay.currentPosition.getDifference(this.overlay.startPosition);
		return difference.x > minSize || difference.y > minSize;
	}

	addMouseDownEventListener(){
		document.addEventListener('mousedown', event => {
			if(event.target.matches(`.${this.overlay.parent}, .${this.overlay.parent} *`)){
				this._showOverlay(new Point(event.pageX, event.pageY));

				// marked selected and clear old selection
				forEach.call(document.querySelectorAll(`.${this._config.selectedClass}`), element => {
					if(event.ctrlKey){
						element.classList.add(this._config.markedClass);
					}
					element.classList.remove(this._config.selectedClass);
				});

				// add marked to current selection
				forEach.call(document.querySelectorAll(`.${this._config.markedClass}`), element => {
					element.classList.add(this._config.inSelectionClass);
				});
				if(event.target.matches(`.${this.overlay.parent} *`)){
					// add or remove to selection
					if(event.target.className.includes(this._config.inSelectionClass)){
						event.target.classList.remove(this._config.inSelectionClass);
					} else{
						event.target.classList.add(this._config.inSelectionClass);
					}
				}
			}
		});
	}

	addMouseUpEventListener(){
		document.addEventListener('mouseup', event => {
			if(event.target.matches(`.${this.overlay.parent}, .${this.overlay.parent} *, #${this.overlay.id}`)){
				this.overlay.domRef.style.display = 'none';

				// set current selection as selected
				forEach.call(document.querySelectorAll(`.${this._config.inSelectionClass}`), element => {
					element.classList.add(this._config.selectedClass);
					element.classList.remove(this._config.inSelectionClass);
				});
				forEach.call(document.querySelectorAll(`.${this._config.markedClass}`), element => {
					element.classList.remove(this._config.markedClass);
				});
			}
		});
	}

	addMouseMoveEventListener(){
		document.addEventListener('mousemove', event => {
			if(event.target.matches(`.${this.overlay.parent}, .${this.overlay.parent} *, #${this.overlay.id}`)){
				this.overlay.currentPosition.x = event.pageX;
				this.overlay.currentPosition.y = event.pageY;

				// if mouseOverlay exists
				if(this.overlay.domRef.style.display != 'none'){
					// update overlay size
					var newMouseOverlayStyle = this.getMouseOverlay();
					var mouseOverlay = document.getElementById(this.overlay.id);
					mouseOverlay.style.top = newMouseOverlayStyle.top+"px";
					mouseOverlay.style.left = newMouseOverlayStyle.left+"px";
					mouseOverlay.style.width = newMouseOverlayStyle.width+"px";
					mouseOverlay.style.height = newMouseOverlayStyle.height+"px";
					mouseOverlay.style.bottom = newMouseOverlayStyle.bottom+"px";
					mouseOverlay.style.right = newMouseOverlayStyle.right+"px";


					// if overlay is bigger than min size
					if(this.isOverlayBiggerThanMinSize()){
						// clear marked
						forEach.call(document.querySelectorAll(`.${this._config.inSelectionClass}:not(.${this._config.markedClass})`), element => {
							element.classList.remove(this._config.inSelectionClass);
						});

						forEach.call(document.querySelectorAll(`.${this._config.markedClass}`), element => {
							element.classList.add(this._config.inSelectionClass);
						});

						forEach.call(document.querySelectorAll(`.${this.overlay.parent} > *`), element => {
							if(this.intersectWithSelection(element)){
								if(element.className.includes(this._config.markedClass)){
									element.classList.remove(this._config.inSelectionClass);
								} else{
									element.classList.add(this._config.inSelectionClass);
								}
							}
						});
					}
				}
			}
		});
	}
}

export {MultiSelection}
