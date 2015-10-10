
// make forEach of Array accessible for use on NodeList without extending the same one 
const forEach = Array.prototype.forEach;

/**
 * Enables sorting of all direct children of an element defined by a given class.
 *
 * @author Thomas Hagemann
 * @class Sort
 */
class Sort {

	/**
	 * Constructs an instance of Sort
	 * Default settings are :
	 *  notSortableClass: "notSortable"
	 *  selectedClassesQuerySelector: undefined,
	 *  dragedClass: "draged",
	 *	sortableGroup: "sortables"
	 *
	 * @constructs Sort
	 * @param {Ojbect} [configuration = {}] - configuration object that can contain {
	 *		notSortableClass: "String representing the class with which elements can not be sorted,
	 *		sortableGroup: "String representing the class of the element containing all sortable elements",
	 *	}
	 * @returns {Sort} instance of Sort 
	 */
	constructor(configuration = {}) {
		// overwrite default configuration by given configuration
		this._config = this._setConfiguration({
			notSortableClass: "notSortable",
			selectedClassesQuerySelector: undefined,
			dragedClass: "draged",
			sortableGroup: "sortables",
		}, configuration);
		this.xbefore = 0;

		// make all childern of sortable group dragable
		forEach.call(document.querySelectorAll(`.${this._config.sortableGroup} > *:not(.${this._config.notSortableClass})`), element => {
			element.draggable = true;
		});

		// create selectionChanged event
		this.sortingStartEvent = new Event('sortingStart');
		this.sortingEvent = new Event('sorting');
		this.sortingEndEvent = new Event('sortingEnd');

		// add mouse events
		this._addDragStartEventListener();
		this._addDragOverEventListener();
		this._addDragEndEventListener();

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

	isAddToLeftSide(hoverdElement, event){
		let isAddToLeftSide = false;
		if(event.pageX-this.xbefore<=0){
			isAddToLeftSide  = true;
		}
		this.xbefore=event.pageX; 
		return isAddToLeftSide;
	}

	/*
	 * Adds mouse down event listener to the document.
	 *
	 * @method _addDragStartEventListener
	 * @returns {MultiSelection} instance of MultiSelection 
	 */
	_addDragStartEventListener(){
		// define short names
		const targetClass = this._config.sortableGroup;
		document.addEventListener('dragstart', event => {
			if(event.target.matches(`.${targetClass} > *`)){

				let dataDragIds = [];
				let dataDragTypes = [];
				let parentId =  Math.trunc(Math.random()*100000);
				event.target.parentElement.setAttribute('parent-drag-id', parentId);

				const selectedElements = this._config.selectedClassesQuerySelector === undefined ? event.target : document.querySelectorAll(this._config.selectedClassesQuerySelector);
				forEach.call(selectedElements, element => {
					if(!element.className.includes(this._config.notSortableClass)){
						let dataDragId = Math.trunc(Math.random()*100000);
						element.classList.add(`${this._config.dragedClass}`);
						element.setAttribute('data-drag-id', dataDragId);
						dataDragIds.push(dataDragId);
						dataDragTypes.push(element.getAttribute('data-drag-id'));
					}
				});

				event.dataTransfer.setData('data-drag-ids', dataDragIds);
				event.dataTransfer.setData('parent-drag-id', parentId);
				event.dataTransfer.effectAllowed = `move`;
			}
		});

	}

	/*
	 * Adds mouse down event listener to the document.
	 *
	 * @method _addDragOverEventListener
	 * @returns {MultiSelection} instance of MultiSelection 
	 */
	_addDragOverEventListener(){
		// define short names
		const targetClass = this._config.sortableGroup;
		document.addEventListener('dragover', event => {
			if(event.target.matches(`.${targetClass} > *:not(.${this._config.dragedClass})`)){

				let currentParrentID = event.target.parentElement.getAttribute(`parent-drag-id`);
				let expectedParrentID = event.dataTransfer.getData(`parent-drag-id`);
				if(currentParrentID == expectedParrentID){
					let dragIDs = event.dataTransfer.getData(`data-drag-ids`);
					if(dragIDs.length > 0){
						dragIDs = dragIDs.split(",");
						dragIDs.forEach((element, index, array) => { array[index] = "[data-drag-id='"+element+"']"; });
						let dragedElements = document.querySelectorAll(dragIDs.join());	

						if(this.isAddToLeftSide(event.target, event)){
							forEach.call(dragedElements, element => {
								event.target.parentNode.insertBefore(element, event.target);
							});	
						} else {
							let refNode = event.target;
							forEach.call(dragedElements, element => {
								refNode.parentNode.insertBefore(element, refNode.nextSibling);
								refNode = element;
							});	
						}
					}
				}
			}
		});	
	}
	
	/*
	 * Adds mouse down event listener to the document.
	 *
	 * @method _addDragEndEventListener
	 * @returns {MultiSelection} instance of MultiSelection 
	 */
	_addDragEndEventListener(){
		// define short names
		const targetClass = this._config.sortableGroup;
		document.addEventListener('dragend', event => {
			if(event.target.matches(`.${targetClass} > *`)){

				forEach.call(document.querySelectorAll(`[parent-drag-id]`), element => {
					element.removeAttribute(`parent-drag-id`);
				});	
				forEach.call(document.querySelectorAll(`[data-drag-id]`), element => {
					element.removeAttribute(`data-drag-id`);
				});	
				forEach.call(document.querySelectorAll(`.${this._config.dragedClass}`), element => {
					element.classList.remove(`${this._config.dragedClass}`);
				});	
				forEach.call(document.querySelectorAll(`.selected`), element => {
					element.classList.remove(`selected`);
				});	
			}
		});
	}
}

export {Sort}
