import {SelectionArea} from "./SelectionArea";

// make forEach of Array accessible for use on NodeList without extending the same one 
const forEach = Array.prototype.forEach;

/**
 * Enables multi selection of all direct children of an element defined by a given class.
 *
 * @author Thomas Hagemann
 * @class MultiSelection
 */
class MultiSelection {

	/**
	 * Constructs an instance of Vector
	 * Default settings are :
	 *	markedClass: "marked"
	 *	selectedClass: "selected"
	 *	inSelectionClass: "inSelection"
	 *	selectionGroup: "selectionGroup"
	 *	selectedCss: "box-shadow: 0 0 5px 2px dodgerblue;"
	 *	inSelectionCss: "box-shadow: 0 0 5px 2px dodgerblue;"
	 *
	 * @constructs MultiSelection
	 * @param {Ojbect} [configuration = {}] - configuration object that can contain {
	 *		markedClass: "String representing the class all elements are marked with, that were already selected when the current selection process began",
	 *		selectedClass: "String representing the class all selected elements are marked with",
	 *		inSelectionClass: "String representing the class all elements are marked with, that are selected with the current selection process",
	 *		selectionGroup: "String representing the class of the element containing all selectable elements",
	 *		markedCss: "String representing the css for elements with the class defined in markedClass",
	 *		selectedCss: "String representing the css for elements with the class defined in selectedClass",
	 *		inSelectionCss: "String representing the css for elements with the class defined in inSelectionCss",
	 *		overlayID: "String representing the id for the overlay element",
	 *		overlayCss: "String representing the css for elements with the id defined in overlayID"
	 *	}
	 * @returns {MultiSelection} instance of MultiSelection 
	 */
	constructor(configuration = {}) {
		// overwrite default configuration by given configuration
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

		// add style for muti selection to document head
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

		// create selection area
		this._overlay = new SelectionArea(this._config.selectionGroup, this._config.overlayID, this._config.overlayCss);

		// add mouse events
		this._addMouseDownEventListener();
		this._addMouseUpEventListener();
		this._addMouseMoveEventListener();

		return this;
	}

	/*
	 * Sets configuration by overwriting default configurations by given configurations
	 *
	 * @method _setConfiguration
	 * @param {Object} [config = {}] - current configuration
	 * @param {Object} [newConfig = {}] - new configuration 
	 * @returns {Object} configuration object
	 */
	_setConfiguration(config = {}, newConfig = {}){
		Object.keys(newConfig).forEach(key => { config[key] = newConfig[key]; });

		return config;
	}

	/*
	 * Adds mouse down event listener to the document.
	 *
	 * @method _addMouseDownEventListener
	 * @returns {MultiSelection} instance of MultiSelection 
	 */
	_addMouseDownEventListener(){
		document.addEventListener('mousedown', event => {
			// define short names
			const targetClass = this._overlay.parent;
			const selectedClass = this._config.selectedClass;
			const inSelectionClass = this._config.inSelectionClass;
			const markedClass = this._config.markedClass;

			// check if mouse down is on defined element or its children
			if(event.target.matches(`.${targetClass}, .${targetClass} *`)){
				this._overlay.setPivot(event.pageX, event.pageY);

				// run through all selected elements and remove the selection, 
				// if inverted selection is active i.e ctrl key is pressed, 
				// add a "marked" flag to the element
				forEach.call(document.querySelectorAll(`.${selectedClass}`), element => {
					if(event.ctrlKey){
						element.classList.add(markedClass);
					}
					element.classList.remove(selectedClass);
				});

				// run through all marked elements and add them to the current selection i.e. "inSelection"
				forEach.call(document.querySelectorAll(`.${markedClass}`), element => {
					element.classList.add(inSelectionClass);
				});

				// check if mouse down is on a selectable element
				// and toggle its current selection marker
				if(event.target.matches(`.${targetClass} *`)){
					if(event.target.className.includes(inSelectionClass)){
						event.target.classList.remove(inSelectionClass);
					} else{
						event.target.classList.add(inSelectionClass);
					}
				}
			}
		});

		return this;
	}

	/*
	 * Adds mouse up event listener to the document.
	 *
	 * @method _addMouseUpEventListener
	 * @returns {MultiSelection} instance of MultiSelection 
	 */
	_addMouseUpEventListener(){
		document.addEventListener('mouseup', event => {
			// define short names
			const targetClass = this._overlay.parent;
			const overlayID = this._overlay.id;
			const selectedClass = this._config.selectedClass;
			const inSelectionClass = this._config.inSelectionClass;
			const markedClass = this._config.markedClass;

			// hide the overlay
			this._overlay.hide();

			// run through all currently selected elements and switch the currently selected marker for the selected one
			forEach.call(document.querySelectorAll(`.${inSelectionClass}`), element => {
				element.classList.add(selectedClass);
				element.classList.remove(inSelectionClass);
			});

			// run through all "marked" elements and remove the flag
			forEach.call(document.querySelectorAll(`.${markedClass}`), element => {
				element.classList.remove(markedClass);
			});
		});

		return this;
	}

	/*
	 * Adds mouse move event listener to the document.
	 *
	 * @method _addMouseMoveEventListener
	 * @returns {MultiSelection} instance of MultiSelection 
	 */
	_addMouseMoveEventListener(){
		document.addEventListener('mousemove', event => {
			// define short names
			const targetClass = this._overlay.parent;
			const overlayID = this._overlay.id;
			const inSelectionClass = this._config.inSelectionClass;
			const markedClass = this._config.markedClass;

			// check if mouse over is on defined element or its children 
			// and if the overlay is visible
			if(event.target.matches(`.${targetClass}, .${targetClass} *`) && this._overlay.isVisible()){

				// update the overlays demensions
				this._overlay.updateDimensions(event.pageX, event.pageY);

				// only if overlay is bigger than min size it is used for selection, so not to influence the click event
				if(this._overlay.isBigerThan()){

					// run through all currently selected elements that are not already been marked
					// and remove them from the current selection
					forEach.call(document.querySelectorAll(`.${inSelectionClass}:not(.${markedClass})`), element => {
						element.classList.remove(inSelectionClass);
					});

					// run through all marked elements and add them to the current selection
					forEach.call(document.querySelectorAll(`.${markedClass}`), element => {
						element.classList.add(inSelectionClass);
					});

					// run through all direct children of the defined elements
					// and check if they intersect with the overlay
					// add or remove them to the current selection
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

		return this;
	}
}

export {MultiSelection}
