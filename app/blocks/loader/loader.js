import $ from "jquery";

export function createLoader(loaderText) {
	let contentString = "";

	if (loaderText) {
		contentString = "<div class=\"loader__text\">" + loaderText + "</div>";
	}

	const modal = "<div class=\"loader\">" +
		"<div class=\"loader__content\">" +
			contentString +
			"<img src=\"assets/images/loader.gif\"/>" +
		"</div>" +
	"</div>";

	$("body").append(modal);
}


export function destroyLoader() {
	$(".loader").remove();
}
