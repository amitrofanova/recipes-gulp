import $ from "jquery";

$(document).ready(function (){
	$(".dish-group__img, .dish-group__title").hover(function() {
		$(this).parent().find(".dish-group__title").toggleClass("dish-group__title_opacity09");
	});
});
