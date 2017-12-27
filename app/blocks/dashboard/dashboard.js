import $ from 'jquery';


function showAddForm() {
	$('.add-recipe').toggle();
}


function showDeleteForm() {
	$('.delete-recipe').toggle();
}


function rotateToggler() {
	$(this).find('.dashboard__toggler').toggleClass('dashboard__toggler_active');
}


function deleteRoundCorners() {
	$(this).toggleClass('dashboard__section_active');
}

$(document).ready(function () {
	$(document).on('click', '.dashboard__add-recipe', showAddForm);
	$(document).on('click', '.dashboard__delete-recipe', showDeleteForm);
	$(document).on('click', '.dashboard__section', rotateToggler);
	$(document).on('click', '.dashboard__section', deleteRoundCorners);
});
