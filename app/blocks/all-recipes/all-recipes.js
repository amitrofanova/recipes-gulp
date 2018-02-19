import $ from 'jquery';
import {INGREDIENTS_TITLE, STEPS_TITLE, ERROR_ALERT}from '../../resources/strings/ru.js';
import {authHeader}from '../auth-form/auth-form.js';
import {showAlert}from '../modal-alert/modal-alert.js';


const pathToJson = 'https://amitrofanova.pythonanywhere.com/api/users/';
const pathToGroups = 'https://amitrofanova.pythonanywhere.com/api/groups/';
const pathToRecipes = 'https://amitrofanova.pythonanywhere.com/api/recipes/';


function appendBreadcrumb(dishGroup) {
	$('.all-recipes').append(
		'<div class="all-recipes__breadcrumb breadcrumb breadcrumb_with-border-bottom">' +
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
				'<img src="' + recipe.image_min + '">' +
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
	let url = pathToJson;

	if (recipe) {
		url = pathToRecipes + encodeURIComponent(recipe);
	}
	else if (group) {
		url = pathToGroups + encodeURIComponent(group);
	}

	$.ajax({
		url,
		headers: {
			Authorization: authHeader()
		},
		dataType: 'json',
		success(data){
			callback(data);
		},
		error(xhr) {
			const err = ERROR_ALERT + xhr.responseText;
			showAlert(err);
		}
	});
	return result;
}


function openDishGroup() {
	const currentDishGroup = $(this).find('.dish-group__title').text();

	$('.dish-group').hide();
	appendBreadcrumb(currentDishGroup);
	$('.all-recipes').append('<div class="dish-group_opened"></div>');

	const callback = function (dishGroup) {
		for (let i = 0; i < dishGroup.recipes.length; i++) {
			const recipe = dishGroup.recipes[i];
			appendRecipePreview(recipe);
		}
	};

	getContent(callback, currentDishGroup);
}

// TODO: move to recipe block
function appendRecipe(recipe) {
	$('<div class="recipe"></div>')
		.insertAfter($('.recipe-preview')[0])
		.append(
			'<div class="recipe__title">'	+ recipe.title + '</div>' +
			'<obj class="recipe__image"	type="image/png">' +
				'<img src="' + recipe.image + '"/>' +
			'</obj>' +
			'<div class="recipe__ingredients-title">' + INGREDIENTS_TITLE + '</div>'	+
			'<ul class="recipe__ingredients"></ul>' +
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

// TODO: move to breadcrumb block
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
