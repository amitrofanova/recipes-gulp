import $ from "jquery";


export function createAlert(alertText, isConfirmation, confirmationName) {
	let controls = "";

	if (isConfirmation) {
		controls =
			"<div class=\"modal-alert__confirm-btn\">Да</div>" +
			"<div class=\"modal-alert__decline-btn\">Отмена</div>";
	}
	else {
		controls = "<div class=\"modal-alert__close-btn\"></div>";
		confirmationName = "";
	}


	const htmlContent =
		"<div class=\"modal-alert " + confirmationName + "\">" +
			"<div class=\"modal-alert__content\">" +
				"<div class=\"modal-alert__text\">" + alertText + "</div>" +
				controls +
			"</div>" +
		"</div>";

	return htmlContent;
}


export function showAlert(alertText, isConfirmation, confirmationName) {
	const alert = createAlert(alertText, isConfirmation, confirmationName);
	$("body").append(alert);
}


export function hideAlert() {
	$(".modal-alert").remove();
}


$(document).ready(function () {
	$(document).on("click", ".modal-alert__close-btn", function () {
		hideAlert();
		location.reload();
	});
	$(document).on("click", ".modal-alert__decline-btn", hideAlert);
});
