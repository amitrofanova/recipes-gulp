import $ from 'jquery';
import {resetForm}from '../add-recipe/add-recipe.js';

// window size at which need to toggle from mobile to desktop version
const windowBreakpoint = 768;


function setActive() {
	var isForm = false;
	var activeClass = this.className;
	if (~activeClass.indexOf("nav__add-recipe")) {
		isForm = true;
	}

	$('.nav__item').removeClass('nav__item_active');
	$(this).addClass('nav__item_active');

	$('.all-recipes, .events, .try-new, .add-recipe').removeClass('active').addClass('hidden');

	if ($(this).hasClass('nav__all-recipes nav__item_active')) {
		$('.all-recipes').addClass('active').removeClass('hidden');
		if (!isForm) {
			resetForm();
		}
	}

	if ($(this).hasClass('nav__events nav__item_active')) {
		$('.events').addClass('active').removeClass('hidden');
		if (!isForm) {
			resetForm();
		}
	}

	if ($(this).hasClass('nav__try-new nav__item_active')) {
		$('.try-new').addClass('active').removeClass('hidden');
		if (!isForm) {
			resetForm();
		}
	}

	if ($(this).hasClass('nav__add-recipe nav__item_active')) {
		$('.add-recipe').addClass('active').removeClass('hidden');
	}
}


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
	$('.nav__item').on('click', setActive);
	$('.nav__item').on('click', toggleMobileNav);
	$(window).on('resize', showLargeNav);
	$(window).on('resize', toggleNavButton);

});
