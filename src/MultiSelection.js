import {Point} from "./Point";

var forEach = Array.prototype.forEach;

class MultiSelection {

	constructor(configuration = {}) {
		this.overlay = {
			"id": "mouseOverlay",
			"parent": "searchArea",
      "startPosition": new Point(0, 0),
      "currentPosition": new Point(0, 0),
			"html":  `<div id="mouseOverlay" style="display: none;"></div>`,
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
			if(event.target.matches('.searchArea, .searchArea *')){
				event.preventDefault();
        this._showOverlay(new Point(event.pageX, event.pageY));

				// marked selected and clear old selection
				forEach.call(document.querySelectorAll(".selected"), element => {
					if(event.ctrlKey){
						element.classList.add('marked');
					}
					element.classList.remove('selected');
				});

				// add marked to current selection
				forEach.call(document.querySelectorAll(".marked"), element => {
					element.classList.add('inSelection');
				});

				if(event.target.className.includes("selectable")){
					// add or remove to selection
					if(event.target.className.includes("inSelection")){
						event.target.classList.remove("inSelection");
					} else{
						event.target.classList.add("inSelection");
					}
				}
			}
		});
  }

  addMouseUpEventListener(){
		document.addEventListener('mouseup', event => {
			if(event.target.matches('.searchArea, .searchArea *, #mouseOverlay, #mouseOverlay *')){
				event.preventDefault();
				this.overlay.domRef.style.display = 'none';

				// set current selection as selected
				forEach.call(document.querySelectorAll(".inSelection"), element => {
					element.classList.add('selected');
					element.classList.remove('inSelection');
				});
				forEach.call(document.querySelectorAll(".marked"), element => {
					element.classList.remove('marked');
				});
			}
		});
  }

  addMouseMoveEventListener(){
		document.addEventListener('mousemove', event => {
			if(event.target.matches('.searchArea, .searchArea *, #mouseOverlay, #mouseOverlay *')){
				event.preventDefault();
					this.overlay.currentPosition.x = event.pageX;
					this.overlay.currentPosition.y = event.pageY;

				// if mouseOverlay exists
				if(this.overlay.domRef.style.display != 'none'){
					// update overlay size
					var newMouseOverlayStyle = this.getMouseOverlay();
					var mouseOverlay = document.querySelector('#mouseOverlay');
					mouseOverlay.style.top = newMouseOverlayStyle.top+"px";
					mouseOverlay.style.left = newMouseOverlayStyle.left+"px";
					mouseOverlay.style.width = newMouseOverlayStyle.width+"px";
					mouseOverlay.style.height = newMouseOverlayStyle.height+"px";
					mouseOverlay.style.bottom = newMouseOverlayStyle.bottom+"px";
					mouseOverlay.style.right = newMouseOverlayStyle.right+"px";


					// if overlay is bigger than min size
					if(this.isOverlayBiggerThanMinSize()){
						// clear marked
						forEach.call(document.querySelectorAll(".inSelection:not(.marked)"), element => {
							element.classList.remove('inSelection');
						});

						forEach.call(document.querySelectorAll(".marked"), element => {
							element.classList.add('inSelection');
						});

						forEach.call(document.querySelectorAll(".selectable"), element => {
							if(this.intersectWithSelection(element)){
								if(element.className.includes("marked")){
									element.classList.remove('inSelection');
								} else{

									element.classList.add('inSelection');
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
