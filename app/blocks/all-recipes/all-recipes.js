import $ from 'jquery';
import {INGREDIENTS_TITLE, STEPS_TITLE}from '../../resources/strings/ru.js';


// const jsonPath = 'assets/data/recipes.json';
// const jsonPath = 'http://192.168.43.130:5000/api/recipes';
// const jsonPath = 'http://192.168.1.46:5000/api/recipes';
const jsonPath = 'https://amitrofanova.pythonanywhere.com/api/recipes';


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


function getContent(callback, group, recipe){
	const result = null;

	let url = jsonPath;
	if (recipe) {
		url += '?recipe=' + recipe;
	}
	else if (group) {
		url += '?group=' + group;
	}

	$.ajax({
		url,
		dataType: 'json',
		success(data){
			callback(data);
		}
	});
	return result;
}


function openDishGroup() {
	const currentDishGroup = $(this).find('.dish-group__title').text();

	$('.dish-group').hide();
	appendBreadcrumb(currentDishGroup);
	$('.all-recipes').append('<section class="dish-group_opened"></section>');

	const callback = function (dishGroup) {
		for (let i = 0; i < dishGroup.recipes.length; i++) {
			const recipe = dishGroup.recipes[i];
			appendRecipePreview(recipe);
		}
	};

	getContent(callback, currentDishGroup);
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

	const components = recipe.components;
	for (let i = 0; i < components.length; i++) {
		$('.recipe__ingredients').append('<li class="recipe__ingredient">' + components[i] + '</li>');
	}

	const steps = recipe.steps;
	for (let i = 0; i < steps.length; i++) {
		$('.recipe__steps').append('<p class="recipe__step">' + steps[i] + '</p');
	}
}


function appendRecipeToBreadcrumb(title) {
	$('.all-recipes__breadcrumb')
		.append('<div class="breadcrumb__arrow"/><div class="breadcrumb__current-recipe">' + title + '</div>');
}


function openRecipe() {
	$('.recipe-preview').hide();
	const recipeTitle = $(this).find('.recipe-preview__title').text();

	const callback = function (recipe) {
		if (recipe !== null) {
			appendRecipeToBreadcrumb(recipeTitle);
			appendRecipe(recipe);
		}
	};

	getContent(callback, null, recipeTitle);
}


$(document).ready(function (){
	$(document).on('click', '.dish-group', openDishGroup);
	$(document).on('click', '.recipe-preview', openRecipe);

});
