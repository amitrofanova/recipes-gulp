import $ from 'jquery';

$(window).on('load', showDishGroups);
$(document).on('click', '.dish-group', openDishGroup);
$(document).on('click', '.recipe-preview', openRecipe);
$(document).on('click', '.breadcrumb__all-dish-groups', backToAllGroups);
$(document).on('click', '.breadcrumb__current-dish-group', backToCurrentGroup);
$('.events__add-item').on('click', addRecipes);

function getRecipes() {
	$.getJSON( "assets/data/recipes2.json", function(dishGroups) {
		for (var i = 0; i < dishGroups.length; i++) {
			console.log( "JSON Data: " + dishGroups[i].group);
			$.each( dishGroups[i].recipes, function(index, item) {
				console.log(dishGroups[i].recipes[index]);
	    });
		}
 });
}

function showDishGroups() {
	$.getJSON( "assets/data/recipes2.json", function(dishGroups) {
			for (var i = 0; i < dishGroups.length; i++) {
				$('.main').append(
					'<div class="main__dish-group dish-group"><img class="dish-group__img" src=' + dishGroups[i].image
					+ '><div class="dish-group__title">' + dishGroups[i].group + '</div></div>');
			}
	});
}

function backToAllGroups() {
	$('.dish-group_opened').remove();
	$('.main__breadcrumb').remove();
	$('.dish-group').show();
}

function backToCurrentGroup() {
	$('.recipe').remove();
	$('.breadcrumb__current-recipe').prev().remove();
	$('.breadcrumb__current-recipe').remove();
	$('.recipe-preview').show();
}

function openDishGroup() {
	var currentDishGroup = $(this).find('.dish-group__title').text();

	$('.dish-group').hide();
	$('.main').append('<div class="main__breadcrumb"><div class="breadcrumb__all-dish-groups">Все рецепты</div><div class="breadcrumb__arrow"/><div class="breadcrumb__current-dish-group">'
	+ currentDishGroup + '</div></div><section class="dish-group_opened"></section>')

	$.getJSON( "assets/data/recipes2.json", function(dishGroups) {
		for (var j = 0; j < dishGroups.length; j++) {
			if (dishGroups[j].group === currentDishGroup) {
				for (var i = 0; i < dishGroups[j].recipes.length; i++) {
					$('.dish-group_opened').append(
						'<div class="recipe-preview"><div class="recipe-preview__image"><img src="'
						+ dishGroups[j].recipes[i].image + '"></div><div class="recipe-preview__content"><div class="recipe-preview__title">'
						+ dishGroups[j].recipes[i].title + '</div><div class="recipe-preview__description">' + dishGroups[j].recipes[i].description + '</div></div></div>');
				}
			}
		}
	});
}

function openRecipe() {
	var recipeTitle = $(this).find('.recipe-preview__title').text();
	console.log(recipeTitle);
	$('.main__breadcrumb').append('<div class="breadcrumb__arrow"/><div class="breadcrumb__current-recipe">' + recipeTitle + '</div>');

	$.getJSON( "assets/data/recipes2.json", function(dishGroups) {
		for (var k = 0; k < dishGroups.length; k++) {
			for (var j = 0; j < dishGroups[k].recipes.length; j++) {
				if (dishGroups[k].recipes[j].title === recipeTitle) {
					$('.recipe-preview').hide();
					$('<div class="recipe"></div>').insertAfter($('.recipe-preview')[0]).append('<div class="recipe__image" style="background: url('
					+ dishGroups[k].recipes[j].image + ') no-repeat 0 0; background-size: cover"></div><div class="recipe__content"><div class="recipe__title">'
					+ dishGroups[k].recipes[j].title + '</div><ul class="recipe__components"></ul></div><div class="recipe__details"></div>');

					var components = [];
					for (var i = 0; i < dishGroups[k].recipes[j].components.length; i++) {
						components.push('<li class="recipe__item">' + dishGroups[k].recipes[j].components[i] + '</li>');
					}
					$('.recipe__components').append(components);

					var steps = [];
					for (var i = 0; i < dishGroups[k].recipes[j].steps.length; i++) {
						steps.push('<p class="recipe__step">' + dishGroups[k].recipes[j].steps[i] + '</p');
					}
					$('.recipe__details').append(steps);
				}
			}
		}
	});
}
