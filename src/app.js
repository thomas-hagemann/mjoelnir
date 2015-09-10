import {MultiSelection} from "./MultiSelection";

global.app = function () {
	var multiSelMarv = new MultiSelection({ selectionGroup: "marvel" });
	var multiSelDC = new MultiSelection({ selectionGroup: "dc" });
	var multiSelIDW = new MultiSelection({ selectionGroup: "idw" });
};
