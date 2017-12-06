import $ from 'jquery';

$(document).ready(function(){

	$('.nav__all-recipes').on('click', showAllRecipes);
	$('.nav__events').on('click', showEvents);
	$('.nav__try-new').on('click', showTryNew);
	$('.nav__add-recipe').on('click', showAddRecipe);
	$('.nav__button').on('click', toggleMobileNav);
	$('.nav__item').on('click', toggleMobileNav);
	$(window).on('resize', showLargeNav);

	function showAllRecipes() {
		$('.events').hide();
		$('.try-new').hide();
		$('.add-recipe').hide();
		$('.all-recipes__breadcrumb').remove();
		$('.dish-group_opened').remove();
		$('.all-recipes__dish-group').show();
	}

	function showEvents() {
		$('.all-recipes').hide();
		$('.try-new').hide();
		$('.add-recipe').hide();
		$('.events').show();
	}

	function showTryNew() {
		$('.all-recipes').hide();
		$('.events').hide();
		$('.add-recipe').hide();
		$('.try-new').show();
	}

	function showAddRecipe() {
		$('.all-recipes').hide();
		$('.events').hide();
		$('.try-new').hide();
		$('.add-recipe').show();
	}

	function toggleMobileNav() {
		// if (window.matchMedia('(max-width: 767px)').matches) {
		if (window.innerWidth <= 767) {
			$('.nav__collapse').toggle();
		}
	}

	// Make nav to be visible after resizing to large screen
	function showLargeNav() {
		// if (window.matchMedia('(min-width: 768px)').matches) {
		if (window.innerWidth >= 768) {
			$('.nav__collapse').show();
		}
		else
			$('.nav__collapse').hide();
	}

});
