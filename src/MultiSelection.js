import {Point} from "./Point";
import {SelectionArea} from "./SelectionArea";

let forEach = Array.prototype.forEach;

class MultiSelection {	

	constructor(configuration = {}) {
		this._config = {
			"markedClass": "marked",
			"selectedClass": "selected",
			"inSelectionClass": "inSelection"
		};
		this.overlay = new SelectionArea({
			"id": "mouseOverlay",
			"parent": "searchArea",
			"pivotPoint": new Point(0, 0),
			"currentPosition": new Point(0, 0),
			"html": `<div id="mouseOverlay" style="display: none;"></div>`,
			"domRef": null
		});

		this.overlay.appendToDom();

		this.addMouseDownEventListener();
		this.addMouseUpEventListener();
		this.addMouseMoveEventListener();
	}

	addMouseDownEventListener(){
		document.addEventListener('mousedown', event => {
			// define short names
			let targetClass = this.overlay.parent;
			let selectedClass = this._config.selectedClass;
			let inSelectionClass = this._config.inSelectionClass;
			let markedClass = this._config.markedClass;

			if(event.target.matches(`.${targetClass}, .${targetClass} *`)){
				this.overlay.setPivot(new Point(event.pageX, event.pageY));

				forEach.call(document.querySelectorAll(`.${selectedClass}`), element => {
					if(event.ctrlKey){
						element.classList.add(markedClass);
					}
					element.classList.remove(selectedClass);
				});

				forEach.call(document.querySelectorAll(`.${markedClass}`), element => {
					element.classList.add(inSelectionClass);
				});
				
				if(event.target.matches(`.${targetClass} *`)){
					if(event.target.className.includes(inSelectionClass)){
						event.target.classList.remove(inSelectionClass);
					} else{
						event.target.classList.add(inSelectionClass);
					}
				}
			}
		});
	}

	addMouseUpEventListener(){
		document.addEventListener('mouseup', event => {
			// define short names
			let targetClass = this.overlay.parent;
			let overlayID = this.overlay.id;
			let selectedClass = this._config.selectedClass;
			let inSelectionClass = this._config.inSelectionClass;
			let markedClass = this._config.markedClass;

			if(event.target.matches(`.${targetClass}, .${targetClass} *, #${overlayID}`)){
				this.overlay.hide();

				forEach.call(document.querySelectorAll(`.${inSelectionClass}`), element => {
					element.classList.add(selectedClass);
					element.classList.remove(inSelectionClass);
				});

				forEach.call(document.querySelectorAll(`.${markedClass}`), element => {
					element.classList.remove(markedClass);
				});
			}
		});
	}

	addMouseMoveEventListener(){
		document.addEventListener('mousemove', event => {
			// define short names
			let targetClass = this.overlay.parent;
			let overlayID = this.overlay.id;
			let inSelectionClass = this._config.inSelectionClass;
			let markedClass = this._config.markedClass;

			if(event.target.matches(`.${targetClass}, .${targetClass} *, #${overlayID}`) && this.overlay.isVisible()){

				this.overlay.updateDimensions(new Point(event.pageX, event.pageY));

				// only if overlay is bigger than min size it is used for selection, so not to influence the click event 
				if(this.overlay.isBigerThan()){

					forEach.call(document.querySelectorAll(`.${inSelectionClass}:not(.${markedClass})`), element => {
						element.classList.remove(inSelectionClass);
					});

					forEach.call(document.querySelectorAll(`.${markedClass}`), element => {
						element.classList.add(inSelectionClass);
					});

					forEach.call(document.querySelectorAll(`.${targetClass} > *`), element => {
						if(this.overlay.intersectsWith(element)){
							if(element.className.includes(markedClass)){
								element.classList.remove(inSelectionClass);
							} else{
								element.classList.add(inSelectionClass);
							}
						}
					});
				}
			}
		});
	}
}

export {MultiSelection}
