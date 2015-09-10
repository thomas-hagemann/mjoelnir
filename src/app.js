global.app = function () {
	 var mousePosition = { 'start':{ 'x': 0, 'y': 0 }, 'current':{ 'x': 0, 'y': 0 } };

	 document.addEventListener('DOMContentLoaded', function() {

		 var forEach = Array.prototype.forEach;

		 function intersectWithSelection(object){
			 var element = {
				 'top': object.getBoundingClientRect().top,
				 'left': object.getBoundingClientRect().left,
				 'width': object.getBoundingClientRect().width,
				 'height': object.getBoundingClientRect().height,
				 'bottom': object.getBoundingClientRect().bottom,
				 'right': object.getBoundingClientRect().right
			 };
			 var selection = getMouseOverlay();
			 return element.right > selection.left && selection.right > element.left &&
					 element.bottom > selection.top && selection.bottom > element.top;
		 }

		 function getMouseOverlay(){
			 return {
				 'top': Math.min(mousePosition.start.y, mousePosition.current.y),
				 'left': Math.min(mousePosition.start.x, mousePosition.current.x),
				 'width': Math.abs(mousePosition.start.x - mousePosition.current.x),
				 'height': Math.abs(mousePosition.start.y - mousePosition.current.y),
				 'bottom': Math.min(mousePosition.start.y, mousePosition.current.y)+Math.abs(mousePosition.start.y - mousePosition.current.y),
				 'right': Math.min(mousePosition.start.x, mousePosition.current.x)+Math.abs(mousePosition.start.x - mousePosition.current.x)
			 };
		 }

		 function isOverlayBiggerThanMinSize(){
			 var minSize = 10;
			 return Math.abs(mousePosition.current.x - mousePosition.start.x) > minSize ||
						 Math.abs(mousePosition.current.y - mousePosition.start.y) > minSize;
		 }

		 document.addEventListener('mousedown', function(event){
			 if(event.target.matches('.searchArea, .searchArea *')){
				 event.preventDefault();
				 mousePosition.start.x = event.pageX;
				 mousePosition.start.y = event.pageY;

				 var overlay = document.createElement("div");
				 overlay.id = 'mouseOverlay';
				 overlay.style.left = mousePosition.start.x+'px';
				 overlay.style.top = mousePosition.start.y+'px';
				 document.body.appendChild(overlay);

				 // marked selected and clear old selection
				 forEach.call(document.querySelectorAll(".selected"), function( element ){
					 if(event.ctrlKey){
						 element.classList.add('marked');
					 }
					 element.classList.remove('selected');
				 });

				 // add marked to current selection
				 forEach.call(document.querySelectorAll(".marked"), function( element ){
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

		 document.addEventListener('mouseup', function(event){
			 if(event.target.matches('.searchArea, .searchArea *, #mouseOverlay, #mouseOverlay *')){
				 event.preventDefault();
				 mousePosition.start.x = 0;
				 mousePosition.start.y = 0;
				 //$("#mouseOverlay").remove();
				 var overlay = document.getElementById("mouseOverlay");
				 overlay.parentNode.removeChild(overlay);

				 // set current selection as selected
				 forEach.call(document.querySelectorAll(".inSelection"), function( element ){
					 element.classList.add('selected');
					 element.classList.remove('inSelection');
				 });
				 forEach.call(document.querySelectorAll(".marked"), function( element ){
					 element.classList.remove('marked');
				 });
			 }
		 });

		 document.addEventListener('mousemove', function(event){
			 if(event.target.matches('.searchArea, .searchArea *, #mouseOverlay, #mouseOverlay *')){
				 event.preventDefault();
				 mousePosition.current.x = event.pageX;
				 mousePosition.current.y = event.pageY;
				 // if mouseOverlay exists

				 if(document.getElementById("mouseOverlay")){
					 // update overlay size
					 var newMouseOverlayStyle = getMouseOverlay();
					 var mouseOverlay = document.querySelector('#mouseOverlay');
					 mouseOverlay.style.top = newMouseOverlayStyle.top+"px";
					 mouseOverlay.style.left = newMouseOverlayStyle.left+"px";
					 mouseOverlay.style.width = newMouseOverlayStyle.width+"px";
					 mouseOverlay.style.height = newMouseOverlayStyle.height+"px";
					 mouseOverlay.style.bottom = newMouseOverlayStyle.bottom+"px";
					 mouseOverlay.style.right = newMouseOverlayStyle.right+"px";


					 // if overlay is bigger than min size
					 if(isOverlayBiggerThanMinSize()){
						 // clear marked
						 forEach.call(document.querySelectorAll(".inSelection:not(.marked)"), function( element ){
							 element.classList.remove('inSelection');
						 });

						 forEach.call(document.querySelectorAll(".marked"), function( element ){
							 element.classList.add('inSelection');
						 });

						 forEach.call(document.querySelectorAll(".selectable"), function( element ){
							 if(intersectWithSelection(element)){
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
	 });
};
