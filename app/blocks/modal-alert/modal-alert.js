import $ from 'jquery';

import {ADDED_RECIPE_ALERT}from '../../resources/strings/ru.js';


export function showSuccessAlert() {
	$('.add-recipe')
		.append(
			'<div class="modal-alert">' +
				'<div class="modal-alert__content">' +
					'<div class="modal-alert__text">' + ADDED_RECIPE_ALERT + '</div>' +
					'<div class="modal-alert__close-btn"></div>' +
				'</div>' +
			'</div>'
		);
}


export function hideSuccessAlert() {
	$('.modal-alert').remove();
}
