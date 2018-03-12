import $ from "jquery";
import {LOADER_TEXT}from "../../resources/strings/ru.js";

export function createLoader() {
	const modal = "<div class=\"loader\">" +
		"<div class=\"loader__content\">" +
			"<div class=\"loader__text\">" + LOADER_TEXT + "</div>" +
			"<img src=\"assets/images/loader.gif\"/>" +
		"</div>" +
	"</div>";
	$("body").append(modal);
}


export function destroyLoader() {
	$(".loader").remove();
}
