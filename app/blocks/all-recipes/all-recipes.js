import $ from 'jquery';

const jsonPath = "assets/data/recipes.json";

$(document).ready(function(){

	$(document).on('click', '.dish-group', openDishGroup);
	$(document).on('click', '.recipe-preview', openRecipe);

	function openDishGroup() {

		const currentDishGroup = $(this).find('.dish-group__title').text();

		$('.dish-group').hide();

		$('.all-recipes').append('<div class="all-recipes__breadcrumb breadcrumb"><div class="breadcrumb__all-dish-groups">Все рецепты</div><div class="breadcrumb__arrow"/><div class="breadcrumb__current-dish-group">'
		+ currentDishGroup + '</div></div><section class="dish-group_opened"></section>')

		$.getJSON(jsonPath, function(dishGroups) {

			for (let j = 0; j < dishGroups.length; j++) {

				if (dishGroups[j].group === currentDishGroup) {

					for (let i = 0; i < dishGroups[j].recipes.length; i++) {

						const recipe = dishGroups[j].recipes[i];

						$('.dish-group_opened').append(
							'<div class="recipe-preview"><div class="recipe-preview__image"><img src="'
							+ recipe.image + '"></div><div class="recipe-preview__content"><div class="recipe-preview__title">'
							+ recipe.title + '</div><div class="recipe-preview__description">' + recipe.description + '</div></div></div>');
					}
				}
			}
		});
	}

	function openRecipe() {

		const recipeTitle = $(this).find('.recipe-preview__title').text();

		$('.all-recipes__breadcrumb').append('<div class="breadcrumb__arrow"/><div class="breadcrumb__current-recipe">' + recipeTitle + '</div>');

		$.getJSON(jsonPath, function(dishGroups) {

			for (let k = 0; k < dishGroups.length; k++) {

				for (let j = 0; j < dishGroups[k].recipes.length; j++) {

					const recipe = dishGroups[k].recipes[j];

					if (recipe.title === recipeTitle) {

						$('.recipe-preview').hide();

						$('<div class="recipe"></div>').insertAfter($('.recipe-preview')[0]).append('<obj class="recipe__image" type="image/png"><img src="'
						+ recipe.image + '"/></obj><div class="recipe__content"><div class="recipe__title">'
						+ recipe.title + '</div><div class="recipe__ingredients-title">Что понадобится:</div><ul class="recipe__ingredients"></ul></div><div class="recipe__steps"><div class="recipe__steps-title">Как готовить:</div></div>');

						var components = [];
						for (let i = 0; i < recipe.components.length; i++) {
							components.push('<li class="recipe__ingredient">' + recipe.components[i] + '</li>');
						}
						$('.recipe__ingredients').append(components);

						var steps = [];
						for (let i = 0; i < recipe.steps.length; i++) {
							steps.push('<p class="recipe__step">' + recipe.steps[i] + '</p');
						}
						$('.recipe__steps').append(steps);
					}
				}
			}
		});
	}

});
