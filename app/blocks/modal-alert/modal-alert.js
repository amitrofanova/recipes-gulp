import $ from 'jquery';


export function showAlert(alertText, isConfirmation) {
	if (isConfirmation) {
		$('body')
			.append(
				'<div class="modal-alert">' +
					'<div class="modal-alert__content">' +
						'<div class="modal-alert__text">' + alertText + '</div>' +
						'<div class="modal-alert__close-btn"></div>' +
						'<div class="modal-alert__confirm-btn">Да</div>' +
						'<div class="modal-alert__decline-btn">Отмена</div>' +
					'</div>' +
				'</div>'
			);
	}
	else {
		$('body')
			.append(
				'<div class="modal-alert">' +
					'<div class="modal-alert__content">' +
						'<div class="modal-alert__text">' + alertText + '</div>' +
						'<div class="modal-alert__close-btn"></div>' +
					'</div>' +
				'</div>'
			);
	}
}


export function hideAlert() {
	$('.modal-alert').remove();
}