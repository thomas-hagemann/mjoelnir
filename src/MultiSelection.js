import {SelectionArea} from "./SelectionArea";

const forEach = Array.prototype.forEach;

class MultiSelection {

	constructor(configuration = {}) {
		this._config = this._setConfiguration({
			markedClass: "marked",
			selectedClass: "selected",
			inSelectionClass: "inSelection",
			selectionGroup: "selectionGroup",
			markedCss: "",
			selectedCss: "box-shadow: 0 0 5px 2px dodgerblue;",
			inSelectionCss: "box-shadow: 0 0 5px 2px dodgerblue;",
			overlayCss: undefined,
			overlayID: undefined
		}, configuration);

		const style = document.createElement("style");
		style.innerHTML = 	`.${this._config.selectionGroup} .${this._config.markedClass} {
			${this._config.markedCss}
		}

		.${this._config.selectionGroup} .${this._config.selectedClass} {
			${this._config.selectedCss}
		}

		.${this._config.selectionGroup} .${this._config.inSelectionClass} {
			${this._config.inSelectionCss}
		}`;
		document.head.insertBefore(style, document.head.firstChild);

		this._overlay = new SelectionArea(this._config.selectionGroup, this._config.overlayID, this._config.overlayCss);

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
			const targetClass = this._overlay.parent;
			const selectedClass = this._config.selectedClass;
			const inSelectionClass = this._config.inSelectionClass;
			const markedClass = this._config.markedClass;

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
			const targetClass = this._overlay.parent;
			const overlayID = this._overlay.id;
			const selectedClass = this._config.selectedClass;
			const inSelectionClass = this._config.inSelectionClass;
			const markedClass = this._config.markedClass;

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
			const targetClass = this._overlay.parent;
			const overlayID = this._overlay.id;
			const inSelectionClass = this._config.inSelectionClass;
			const markedClass = this._config.markedClass;

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
