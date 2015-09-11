import {MultiSelection} from "./MultiSelection";


function getInversedColor(color){
	let red, green, blue, alpha;
	alpha = 0.4;
	if(color.startsWith("#")){
		[red, green, blue] = color.substr(1).match(/.{1,2}/g);
		red = parseInt(red, 16).toString(10);
		green = parseInt(green, 16).toString(10);
		blue = parseInt(blue, 16).toString(10);
	} else if(color.includes('(')){
		color = color.substring(color.indexOf("(")+1, color.indexOf(")"));
		[red, green, blue, alpha = 0.4] = color.split(",");
		red = parseInt(red, 10);
		green = parseInt(green, 10);
		blue = parseInt(blue, 10);
	}
	return `rgba(${255-red}, ${255-green}, ${255-blue}, ${alpha})`;
}

global.app = function () {
	new MultiSelection({
			selectionGroup: "marvel",
			selectedCss: `background: ${getInversedColor("rgba(237, 28, 36, 1)")}; color: ${getInversedColor("rgba(255, 255, 255, 1)")}`,
			inSelectionCss: `background: ${getInversedColor("rgba(237, 28, 36, 1)")}; color: ${getInversedColor("rgba(255, 255, 255, 1)")}`,
			overlayCss: "background: rgba(18, 227, 219, 0.4); color: rgba(0, 0, 0, 0.4);"
	});

	new MultiSelection({
		selectionGroup: "dc",
		selectedCss: `background: ${getInversedColor("rgba(7, 112, 178, 1)")}; color: ${getInversedColor("rgba(19, 19, 19, 1)")}`,
		inSelectionCss: `background: ${getInversedColor("rgba(7, 112, 178, 1)")}; color: ${getInversedColor("rgba(19, 19, 19, 1)")}`,
		overlayCss: "background: rgba(255, 255, 255, 0.4); color: rgba(0, 24, 236, 0.4);"
	});

	new MultiSelection({
		selectionGroup: "idw",
		selectedCss: `background: ${getInversedColor("rgba(255, 255, 255, 1)")}; color: ${getInversedColor("rgba(0, 57, 102, 1)")}`,
		inSelectionCss:	`background: ${getInversedColor("rgba(255, 255, 255, 1)")}; color: ${getInversedColor("rgba(0, 57, 102, 1)")}`,
		overlayCss: "background: rgba(0, 0, 0, 0.4); color: rgba(255, 198, 153, 0.4);"
	});
};
