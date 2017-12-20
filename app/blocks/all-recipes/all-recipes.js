import $ from 'jquery';
import {INGREDIENTS_TITLE, STEPS_TITLE} from '../../resources/strings/ru.js';


const jsonPath = 'assets/data/recipes.json';


function appendBreadcrumb(dishGroup) {
	$('.all-recipes').append(
		'<div class="all-recipes__breadcrumb breadcrumb">' +
			'<div class="breadcrumb__all-dish-groups">Все рецепты</div>' +
			'<div class="breadcrumb__arrow"/>' +
			'<div class="breadcrumb__current-dish-group">' + dishGroup + '</div>' +
		'</div>'
	);
}


function appendRecipePreview(recipe) {
	$('.dish-group_opened').append(
		'<div class="recipe-preview">' +
			'<div class="recipe-preview__image">' +
				'<img src="' + recipe.image + '">' +
			'</div>' +
			'<div class="recipe-preview__content">' +
				'<div class="recipe-preview__title">'	+	recipe.title + '</div>' +
				'<div class="recipe-preview__description">' + recipe.description + '</div>' +
			'</div>' +
		'</div>'
	);
}


function openDishGroup() {
	const currentDishGroup = $(this).find('.dish-group__title').text();

	$('.dish-group').hide();
	appendBreadcrumb(currentDishGroup);
	$('.all-recipes').append('<section class="dish-group_opened"></section>');

	$.getJSON(jsonPath, function (dishGroups) {
		for (let j = 0; j < dishGroups.length; j++) {
			var dishGroup = dishGroups[j];

			if (dishGroup.group === currentDishGroup) {
				for (let i = 0; i < dishGroup.recipes.length; i++) {
					var recipe = dishGroup.recipes[i];
					appendRecipePreview(recipe);
				}
				break;
			}
		}
	});
}


function appendRecipe(recipe) {
	$('<div class="recipe"></div>')
		.insertAfter($('.recipe-preview')[0])
		.append(
			'<obj class="recipe__image"	type="image/png">' +
				'<img src="' + recipe.image + '"/>' +
			'</obj>' +
			'<div class="recipe__content">' +
				'<div class="recipe__title">'	+ recipe.title + '</div>' +
				'<div class="recipe__ingredients-title">' + INGREDIENTS_TITLE + '</div>'	+
				'<ul class="recipe__ingredients"></ul>' +
			'</div>' +
			'<div class="recipe__steps">' +
			'<div class="recipe__steps-title">' + STEPS_TITLE + '</div>'
		);

		var components = recipe.components;
		for (let i = 0; i < components.length; i++) {
			$('.recipe__ingredients').append('<li class="recipe__ingredient">' + components[i] + '</li>');
		}

		var steps = recipe.steps;
		for (let i = 0; i < steps.length; i++) {
			$('.recipe__steps').append('<p class="recipe__step">' + steps[i] + '</p');
		}
}


function appendRecipeToBreadcrumb(title) {
	$('.all-recipes__breadcrumb')
		.append('<div class="breadcrumb__arrow"/><div class="breadcrumb__current-recipe">' + title + '</div>');
}


function openRecipe() {
	const recipeTitle = $(this).find('.recipe-preview__title').text();

	appendRecipeToBreadcrumb(recipeTitle);

	$.getJSON(jsonPath, function (dishGroups) {
		let recipe = null;

		for (let k = 0; k < dishGroups.length; k++) {
			const recipes = dishGroups[k].recipes;

			for (let j = 0; j < recipes.length; j++) {
				if (recipes[j].title === recipeTitle) {
					recipe = recipes[j];
					break;
				}
			}

			// if found in current dish group
			if (recipe !== null) {
				break;
			}
		}

		if (recipe !== null) {
			$('.recipe-preview').hide();
			appendRecipe(recipe);
		}
	});
}



$(document).ready(function (){

	$(document).on('click', '.dish-group', openDishGroup);
	$(document).on('click', '.recipe-preview', openRecipe);

});
