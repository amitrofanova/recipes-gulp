import $ from 'jquery';

const jsonPath = "assets/data/recipes3.json";

$(document).ready(function(){

	$(document).on('click', '.dish-group', openDishGroup);
	$(document).on('click', '.recipe-preview', openRecipe);
	$(document).on('click', '.breadcrumb__all-dish-groups', backToAllGroups);
	$(document).on('click', '.breadcrumb__current-dish-group', backToCurrentGroup);
	$(document).on('click', '.nav__all-recipes', showAllRecipes);

});

function showAllRecipes() {
	$('.add-recipe').hide();
	$('.all-recipes').show();
}

function getImageFromJSON(imageData) {
	var image = new Image();
	image.src = imageData;
	return image.src;
}

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

function openDishGroup() {
	var currentDishGroup = $(this).find('.dish-group__title').text();

	$('.dish-group').hide();
	$('.all-recipes').append('<div class="all-recipes__breadcrumb breadcrumb"><div class="breadcrumb__all-dish-groups">Все рецепты</div><div class="breadcrumb__arrow"/><div class="breadcrumb__current-dish-group">'
	+ currentDishGroup + '</div></div><section class="dish-group_opened"></section>')

	$.getJSON(jsonPath, function(dishGroups) {
		for (let j = 0; j < dishGroups.length; j++) {
			if (dishGroups[j].group === currentDishGroup) {
				for (let i = 0; i < dishGroups[j].recipes.length; i++) {
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
	$('.all-recipes__breadcrumb').append('<div class="breadcrumb__arrow"/><div class="breadcrumb__current-recipe">' + recipeTitle + '</div>');

	$.getJSON(jsonPath, function(dishGroups) {
		for (let k = 0; k < dishGroups.length; k++) {
			for (let j = 0; j < dishGroups[k].recipes.length; j++) {
				if (dishGroups[k].recipes[j].title === recipeTitle) {
					$('.recipe-preview').hide();
					$('<div class="recipe"></div>').insertAfter($('.recipe-preview')[0]).append('<obj class="recipe__image" type="image/png"><img src="'
					+ dishGroups[k].recipes[j].image + '"/></obj><div class="recipe__content"><div class="recipe__title">'
					+ dishGroups[k].recipes[j].title + '</div><div class="recipe__ingredients-title">Что понадобится:</div><ul class="recipe__ingredients"></ul></div><div class="recipe__steps"><div class="recipe__steps-title">Как готовить:</div></div>');

					var components = [];
					for (let i = 0; i < dishGroups[k].recipes[j].components.length; i++) {
						components.push('<li class="recipe__ingredient">' + dishGroups[k].recipes[j].components[i] + '</li>');
					}
					$('.recipe__ingredients').append(components);

					var steps = [];
					for (let i = 0; i < dishGroups[k].recipes[j].steps.length; i++) {
						steps.push('<p class="recipe__step">' + dishGroups[k].recipes[j].steps[i] + '</p');
					}
					$('.recipe__steps').append(steps);
				}
			}
		}
	});
}

// function getRecipes() {
// 	$.getJSON(jsonPath, function(dishGroups) {
// 		for (let i = 0; i < dishGroups.length; i++) {
// 			$.each(dishGroups[i].recipes, function(index, item) {
// 				console.log(dishGroups[i].recipes[index]);
// 	    });
// 		}
//  });
// }

// function loadAllRecipes() {
// 	$.getJSON(jsonPath, function(dishGroups) {
// 		for (let i = 0; i < dishGroups.length; i++) {
// 			$('.all-recipes').append('<div class="all-recipes__dish-group dish-group"><img class="dish-group__img" src='
// 			+ getImageFromJSON(dishGroups[i].image) + '><div class="dish-group__title">' + dishGroups[i].group + '</div></div>');
// 		}
// 	});
// }

// function loadAllRecipes() {
// 	$.getJSON(jsonPath, function(dishGroups) {
// 			for (let i = 0; i < dishGroups.length; i++) {
// 				console.log(dishGroups[i].group);
// 				$('.all-recipes').append(
// 					'<div class="all-recipes__dish-group dish-group"><img class="dish-group__img" src=' + dishGroups[i].image
// 					+ '><div class="dish-group__title">' + dishGroups[i].group + '</div></div>');
// 			}
// 	});
// }
