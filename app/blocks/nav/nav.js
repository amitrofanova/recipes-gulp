import $ from 'jquery';
// import {resetForm}from '../add-recipe/add-recipe.js';


// window size at which need to toggle from mobile to desktop version
const windowBreakpoint = 768;


function showAllRecipes() {
	if ($(this).hasClass('nav__all-recipes')) {
		$('.all-recipes__breadcrumb').remove();
		$('.dish-group_opened').remove();
		$('.all-recipes__dish-group').show();
	}
}


function toggleNavButton() {
	if ($('.nav__collapse').css('display') === 'none') {
		$('.nav__button').addClass('nav__button_open');
		$('.nav__button').removeClass('nav__button_close');
	}
	else if ($('.nav__collapse').css('display') === 'block') {
		$('.nav__button').addClass('nav__button_close');
		$('.nav__button').removeClass('nav__button_open');
	}
}


function toggleMobileNav() {
	if (window.innerWidth < windowBreakpoint) {
		$('.nav__collapse').toggle();
	}
	toggleNavButton();
}


// Make nav to be visible after resizing to large screen
function showLargeNav() {
	if (window.innerWidth >= windowBreakpoint) {
		$('.nav__collapse').show();
	}
	else {
		$('.nav__collapse').hide();
	}
}


$(document).ready(function () {

	toggleNavButton();
	$('.nav__all-recipes').on('click', showAllRecipes);
	$('.nav__button').on('click', toggleMobileNav);
	$('.nav__item').on('click', toggleMobileNav);
	$(window).on('resize', showLargeNav);
	$(window).on('resize', toggleNavButton);

});
