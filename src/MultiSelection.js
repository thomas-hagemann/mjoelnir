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
	 * Constructs an instance of MultiSelection
	 * Default settings are :
	 *  notSelectableClass: "notSelectable"
	 *	wasSelectedClass: "wasSelected"
	 *	selectedClass: "selected"
	 *	willBeSelectedClass: "willBeSelected"
	 *	selectionGroup: "selectionGroup"
	 *	selectedCss: "box-shadow: 0 0 5px 2px dodgerblue;"
	 *	willBeSelectedCss: "box-shadow: 0 0 5px 2px dodgerblue;"
	 *
	 * @constructs MultiSelection
	 * @param {Ojbect} [configuration = {}] - configuration object that can contain {
	 *		notSelectableClass: "String representing the class with which elements can not be selected,
	 *		wasSelectedClass: "String representing the class all elements are marked with, that were already selected when the current selection process began",
	 *		selectedClass: "String representing the class all selected elements are marked with",
	 *		willBeSelectedClass: "String representing the class all elements are marked with, that are selected with the current selection process",
	 *		selectionGroup: "String representing the class of the element containing all selectable elements",
	 *		wasSelectedCss: "String representing the css for elements with the class defined in wasSelectedClass",
	 *		selectedCss: "String representing the css for elements with the class defined in selectedClass",
	 *		willBeSelectedCss: "String representing the css for elements with the class defined in willBeSelectedCss",
	 *		overlayID: "String representing the id for the overlay element",
	 *		overlayCss: "String representing the css for elements with the id defined in overlayID"
	 *	}
	 * @returns {MultiSelection} instance of MultiSelection 
	 */
	constructor(configuration = {}) {
		// overwrite default configuration by given configuration
		this._config = this._setConfiguration({
			notSelectableClass: "notSelectable",
			wasSelectedClass: "wasSelected",
			willBeSelectedClass: "willBeSelected",
			selectedClass: "selected",
			selectionGroup: "selectionGroup",
			wasSelectedCss: "",
			willBeSelectedCss: "box-shadow: 0 0 5px 2px dodgerblue;",
			selectedCss: "box-shadow: 0 0 5px 2px dodgerblue;",
			overlayCss: undefined,
			overlayID: undefined
		}, configuration);

		// add style for muti selection to document head
		const style = document.createElement("style");
		style.innerHTML = 	`.${this._config.selectionGroup} .${this._config.wasSelectedClass} {
			${this._config.wasSelectedCss}
		}
		.${this._config.selectionGroup} .${this._config.selectedClass} {
			${this._config.selectedCss}
		}
		.${this._config.selectionGroup} .${this._config.willBeSelectedClass} {
			${this._config.willBeSelectedCss}
		}`;
		document.head.insertBefore(style, document.head.firstChild);

		// create selection area
		this._overlay = new SelectionArea(this._config.selectionGroup, this._config.overlayID, this._config.notSelectableClass, this._config.overlayCss);
		this._config.overlayID = this._overlay.id;

		// create last selection memory
		this._lastSelection = [];
		// create selectionChanged event
		this._selectionChangedEvent = new Event('selectionChanged');

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
	 * @param {Object} [config = {}] - current configuratio
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
		// define short names
		const targetClass = this._config.selectionGroup;

		document.addEventListener('mousedown', event => {
			// check if mouse down is on defined element
			if(event.target.matches(`.${targetClass}`)){
			
				this._overlay.setPivot(event.pageX, event.pageY);

				// run through all selected elements
				// mark all elemtents that were already selected 
				// and remove them from selection
				forEach.call(document.querySelectorAll(`.${targetClass} .${this._config.selectedClass}`), element => {
					if(event.ctrlKey){
						this._addToWasSelected(element);
					}
					this._removeFromSelection(element);
				});

				// run through all marked elements and add them to the current selection i.e. "inSelection"
				forEach.call(document.querySelectorAll(`.${targetClass} .${this._config.wasSelectedClass}`), element => {
					this._addToWillBeSelected(element);
				});
			}
		});

		document.addEventListener('mousedown', event => {
			// check if mouse down is on the children of the defined element
			if(event.target.matches(`.${targetClass} > *`)){
				event.stopPropagation();
				
				if(event.ctrlKey){	
					if(event.target.className.includes(this._config.selectedClass)){
						this._removeFromSelection(event.target);
					}else{
						this._addToWillBeSelected(event.target);
						this._addToWasSelected(event.target);
					}
				} else {
					if(!event.target.className.includes(this._config.selectedClass)){
						forEach.call(document.querySelectorAll(`.${targetClass} .${this._config.selectedClass}`), element => {
							this._removeFromSelection(element);
						});	
					}
					this._addToWillBeSelected(event.target);
				}
			}
		});

		return this;
	}
	
	_checkAndThrowSelectionChangeEvent(){
		const lastSelection = this._lastSelection;
		const currentSelection = [...document.querySelectorAll(`.${this._config.selectionGroup} .${this._config.selectedClass}`)];

		// if elements that are selected and were selected before are diffrent 
		// a selection change event is triggert
		if(!(currentSelection.length == lastSelection.length 
			&& currentSelection.every((element, index) => element === lastSelection[index]))){
			forEach.call(document.querySelectorAll(`.${this._config.selectionGroup}`), element => {
				this._selectionChangedEvent.selection = currentSelection;
				element.dispatchEvent(this._selectionChangedEvent);
			});			
		}
		this._lastSelection = currentSelection;
	}

	/*
	 * Adds mouse up event listener to the document.
	 *
	 * @method _addMouseUpEventListener
	 * @returns {MultiSelection} instance of MultiSelection 
	 */
	_addMouseUpEventListener(){
		// define short names
		const targetClass = this._config.selectionGroup;

		document.addEventListener(`mouseup`, event => {
			if(event.target.matches(`.${targetClass}, .${targetClass} > *, #${this._config.overlayID}`)){
			
				if(!event.ctrlKey){	
					forEach.call(document.querySelectorAll(`.${targetClass} .${this._config.selectedClass}`), element => {
						this._removeFromSelection(element);
					});	
				}

				// run through all currently selected elements and switch the currently selected marker for the selected one
				forEach.call(document.querySelectorAll(`.${targetClass} .${this._config.willBeSelectedClass}`), element => {
					this._addToSelection(element)._removeFromWillBeSelected(element);
				});
				
				// run through all "marked" elements and remove the flag
				forEach.call(document.querySelectorAll(`.${targetClass} .${this._config.wasSelectedClass}`), element => {
					this._removeFromWasSelected(element);
				});

				// hide the overlay
				this._overlay.hide();

				this._checkAndThrowSelectionChangeEvent();
			}
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
		// define short names
		const targetClass = this._config.selectionGroup;
		const wasSelectedClass = this._config.wasSelectedClass;

		document.addEventListener('mousemove', event => {
			// check if mouse over is on defined element or its children 
			// and if the overlay is visible
			if(event.target.matches(`.${targetClass}, .${targetClass} *`)){
				
				if(this._overlay.isVisible()){
					// update the overlays demensions
					this._overlay.updateDimensions(event.pageX, event.pageY);

					// only if overlay is bigger than min size it is used for selection, so not to influence the click event
					if(this._overlay.isBigerThan(event.pageX, event.pageY)){

						// reset everything that will be selected by the overlay, except elements that were already selected
						// this makes sure once hoverd elements are not selected when the overlay does not intersect with them anymore
						forEach.call(document.querySelectorAll(`.${targetClass} .${this._config.willBeSelectedClass}:not(.${wasSelectedClass})`), element => {
							this._removeFromWillBeSelected(element);
						});

	                    // run through all marked elements and add them to the current selection
	                    forEach.call(document.querySelectorAll(`.${targetClass} .${wasSelectedClass}`), element => {
	                        this._addToWillBeSelected(element);
	                    });

						// run through all direct children of the selection content element
						// and check if they intersect with the overlay
						// and if so add or remove them to the current selection
						forEach.call(document.querySelectorAll(`.${targetClass} > *`), element => {
							if(this._overlay.intersectsWith(element)){
								if(element.className.includes(wasSelectedClass)){
									this._removeFromWillBeSelected(element);
								} else{
									this._addToWillBeSelected(element);
								}
							}
						});
					}
				}
			}
		});

		return this;
	}

	/*
	 * Add "wasSelectedClass"-class to element 
	 * This means the element was already selected by the last selection process.
	 *
	 * @method _addToWasSelected
	 * @param {Object} element - element that the call will be added to
	 * @returns {MultiSelection} instance of MultiSelection 
	 */
	 _addToWasSelected(element){
		element.classList.add(this._config.wasSelectedClass);

		return this;
	}

	/*
	 * Remove "wasSelectedClass"-class from element 
	 *
	 * @method _removeFromWasSelected
	 * @param {Object} element - element that the class will be removed from
	 * @returns {MultiSelection} instance of MultiSelection 
	 */
	_removeFromWasSelected(element){
		element.classList.remove(this._config.wasSelectedClass);

		return this;
	}

	/*
	 * Add "willBeSelectedClass"-class to element if it is not marked with the not selectable class
	 * This means the element will be selected by the current selection process.
	 *
	 * @method _addToWasSelected
	 * @param {Object} element - element that the call will be added to
	 * @returns {MultiSelection} instance of MultiSelection 
	 */
	_addToWillBeSelected(element){
		if(!element.className.includes(this._config.notSelectableClass)){
			element.classList.add(this._config.willBeSelectedClass);
		}

		return this;
	}
	
	/*
	 * Remove "willBeSelectedClass"-class from element 
	 *
	 * @method _removeFromWillBeSelected
	 * @param {Object} element - element that the class will be removed from
	 * @returns {MultiSelection} instance of MultiSelection 
	 */
	_removeFromWillBeSelected(element){
		element.classList.remove(this._config.willBeSelectedClass);

		return this;
	}

	/*
	 * Add "willBeSelectedClass"-class to element 
	 * This means the element in selected.
	 *
	 * @method _addToWasSelected
	 * @param {Object} element - element that the call will be added to
	 * @returns {MultiSelection} instance of MultiSelection 
	 */
	_addToSelection(element){
		if(!element.className.includes(this._config.notSelectableClass)){
			element.classList.add(this._config.selectedClass);
		}
		
		return this;
	}

	/*
	 * Remove "selectedClass"-class from element 
	 *
	 * @method _removeFromSelection
	 * @param {Object} element - element that the class will be removed from
	 * @returns {MultiSelection} instance of MultiSelection 
	 */
	_removeFromSelection(element){
		element.classList.remove(this._config.selectedClass);
		
		return this;
	}
}

export {MultiSelection}
