import $ from 'jquery';

$('.nav__button').on('click', toggleNav);
$('.nav__item').on('click', toggleNav);
$(window).on('resize', toggleNav);

function toggleNav() {
	if (window.matchMedia('(max-width: 767px)').matches) {
		$('.nav__collapse').toggle();
	}
	else {
		$('.nav__collapse').show();
	}
}
