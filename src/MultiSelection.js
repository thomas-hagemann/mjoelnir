import {SelectionArea} from "./SelectionArea";

let forEach = Array.prototype.forEach;

class MultiSelection {	

	constructor(configuration = {}) {
		this._config = this._setConfiguration({
			markedClass: "marked",
			selectedClass: "selected",
			inSelectionClass: "inSelection",
			selectionGroup: "selectionGroup",
			overlayID: undefined
		}, configuration);

		this._overlay = new SelectionArea(this._config.selectionGroup, this._config.overlayID);

		this._addMouseDownEventListener();
		this._addMouseUpEventListener();
		this._addMouseMoveEventListener();
	}

	_setConfiguration(localConfig = {}, newConfig = {}){
		Object.keys(newConfig).forEach(key => { localConfig[key] = newConfig[key]; });
		return localConfig;
	}

	_addMouseDownEventListener(){
		document.addEventListener('mousedown', event => {
			// define short names
			let targetClass = this._overlay.parent;
			let selectedClass = this._config.selectedClass;
			let inSelectionClass = this._config.inSelectionClass;
			let markedClass = this._config.markedClass;

			if(event.target.matches(`.${targetClass}, .${targetClass} *`)){
				this._overlay.setPivot(event.pageX, event.pageY);

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

	_addMouseUpEventListener(){
		document.addEventListener('mouseup', event => {
			// define short names
			let targetClass = this._overlay.parent;
			let overlayID = this._overlay.id;
			let selectedClass = this._config.selectedClass;
			let inSelectionClass = this._config.inSelectionClass;
			let markedClass = this._config.markedClass;

			if(event.target.matches(`.${targetClass}, .${targetClass} *, #${overlayID}`)){
				this._overlay.hide();

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

	_addMouseMoveEventListener(){
		document.addEventListener('mousemove', event => {
			// define short names
			let targetClass = this._overlay.parent;
			let overlayID = this._overlay.id;
			let inSelectionClass = this._config.inSelectionClass;
			let markedClass = this._config.markedClass;

			if(event.target.matches(`.${targetClass}, .${targetClass} *, #${overlayID}`) && this._overlay.isVisible()){

				this._overlay.updateDimensions(event.pageX, event.pageY);

				// only if overlay is bigger than min size it is used for selection, so not to influence the click event 
				if(this._overlay.isBigerThan()){

					forEach.call(document.querySelectorAll(`.${inSelectionClass}:not(.${markedClass})`), element => {
						element.classList.remove(inSelectionClass);
					});

					forEach.call(document.querySelectorAll(`.${markedClass}`), element => {
						element.classList.add(inSelectionClass);
					});

					forEach.call(document.querySelectorAll(`.${targetClass} > *`), element => {
						if(this._overlay.intersectsWith(element)){
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
