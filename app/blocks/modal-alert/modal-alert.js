import $ from 'jquery';


export function showSuccessAlert(form, alert) {
	form
		.append(
			'<div class="modal-alert">' +
				'<div class="modal-alert__content">' +
					'<div class="modal-alert__text">' + alert + '</div>' +
					'<div class="modal-alert__close-btn"></div>' +
				'</div>' +
			'</div>'
		);
}


export function hideSuccessAlert() {
	$('.modal-alert').remove();
}
