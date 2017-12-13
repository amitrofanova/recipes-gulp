import $ from 'jquery';

$(document).ready(function(){
	toggleNavButton();
	$('.nav__all-recipes').on('click', showAllRecipes);
	$('.nav__events').on('click', showEvents);
	$('.nav__try-new').on('click', showTryNew);
	$('.nav__add-recipe').on('click', showAddRecipe);
	$('.nav__button').on('click', toggleMobileNav);
	$('.nav__item').on('click', toggleMobileNav);
	$(window).on('resize', showLargeNav);
	$(window).on('resize', toggleNavButton);

	function showAllRecipes() {
		$('.events').hide();
		$('.try-new').hide();
		$('.add-recipe').hide();
		$('.all-recipes__breadcrumb').remove();
		$('.dish-group_opened').remove();
		$('.all-recipes').show();
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

	function toggleNavButton() {
		if ($('.nav__collapse').css('display') === 'none') {
			$('.nav__button').addClass("nav__button_open");
			$('.nav__button').removeClass("nav__button_close");
		}
		else if ($('.nav__collapse').css('display') === 'block') {
			$('.nav__button').addClass("nav__button_close");
			$('.nav__button').removeClass("nav__button_open");
		}
	}

	function toggleMobileNav() {
		if (window.innerWidth <= 767) {
			$('.nav__collapse').toggle();
		}
		toggleNavButton();
	}

	// Make nav to be visible after resizing to large screen
	function showLargeNav() {
		if (window.innerWidth >= 768) {
			$('.nav__collapse').show();
		}
		else
			$('.nav__collapse').hide();
	}

});
