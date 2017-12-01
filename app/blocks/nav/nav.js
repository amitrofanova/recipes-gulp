import $ from 'jquery';

$('.nav__button').on('click', toggleMobileNav);
$('.nav__item').on('click', toggleMobileNav);
$(window).on('resize', showNav);

function toggleMobileNav() {
	if (window.matchMedia('(max-width: 767px)').matches) {
		$('.nav__collapse').toggle();
	}
}

// Make nav to be visible after resizing to large screen
function showNav() {
	if (window.matchMedia('(min-width: 768px)').matches) {
		$('.nav__collapse').show();
	}
}
