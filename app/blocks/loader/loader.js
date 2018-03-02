import $ from "jquery";

export function createLoader() {
	const modal = "<div class=\"loader\">" +
		"<div class=\"loader__content\">" +
			"<div class=\"loader__text\">Пожалуйста подождите, ваш запрос обрабатывается</div>" +
		"</div>" +
	"</div>";
	$("body").append(modal);
}


export function destroyLoader() {
	$(".loader").remove();
}
