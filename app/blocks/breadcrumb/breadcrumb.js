import $ from 'jquery';


$(document).ready(function() {

	$(document).on('click', '.breadcrumb__all-dish-groups', backToAllGroups);
	$(document).on('click', '.breadcrumb__current-dish-group', backToCurrentGroup);

});


function backToAllGroups() {
	$('.dish-group_opened').remove();
	$('.all-recipes__breadcrumb').remove();
	$('.dish-group').show();
}


function backToCurrentGroup() {
	$('.recipe').remove();
	$('.breadcrumb__current-recipe').prev().remove();
	$('.breadcrumb__current-recipe').remove();
	$('.recipe-preview').show();
}
