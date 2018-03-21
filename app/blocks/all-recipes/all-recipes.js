import $ from "jquery";
import {INGREDIENTS_TITLE, STEPS_TITLE, ERROR_ALERT, EMPTY_GROUP_ALERT}from "../../resources/strings/ru.js";
import {authHeader}from "../auth-form/auth-form.js";
import {showAlert}from "../modal-alert/modal-alert.js";
import {jsonPath}from "../../resources/paths/paths.js";


function appendBreadcrumb(dishGroup) {
	$(".all-recipes").append(
		"<div class=\"all-recipes__breadcrumb breadcrumb breadcrumb_with-border-bottom\">" +
			"<div class=\"breadcrumb__all-dish-groups\">Все рецепты</div>" +
			"<div class=\"breadcrumb__arrow\"/>" +
			"<div class=\"breadcrumb__current-dish-group\">" + dishGroup + "</div>" +
		"</div>"
	);
}


function appendRecipePreview(recipe) {
	let imgSrc = "";
	if (!recipe.image_min_hash) {
		imgSrc = "assets/images/empty-image.jpg";
	}
	else {imgSrc = jsonPath + "/api/image/" + recipe.image_min_hash;}

	$(".dish-group_opened").append(
		"<div class=\"recipe-preview\">" +
			"<div class=\"recipe-preview__image\">" +
				"<img src=\"" + imgSrc + "\">" +
			"</div>" +
			"<div class=\"recipe-preview__content\">" +
				"<div class=\"recipe-preview__id\">"	+	recipe.id + "</div>" +
				"<div class=\"recipe-preview__title\">"	+	recipe.title + "</div>" +
				"<div class=\"recipe-preview__description\">" + recipe.description + "</div>" +
			"</div>" +
		"</div>"
	);
}


function getContent(callback, group, recipeId){
	const result = null;
	let url = jsonPath;

	if (recipeId) {
		url += "/api/recipes/" + recipeId;
	}
	else if (group) {
		url += "/api/groups/" + encodeURIComponent(group);
	}

	$.ajax({
		url,
		headers: {
			Authorization: authHeader()
		},
		dataType: "json",
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
	const currentDishGroup = $(this).find(".dish-group__title").text();

	$(".dish-group").hide();
	appendBreadcrumb(currentDishGroup);
	$(".all-recipes").append("<div class=\"dish-group_opened\"></div>");

	const callback = function (dishGroup) {
		if (!dishGroup.recipes.length) {
			$(".dish-group_opened").append("<span class=\"dish-group__alert\">" + EMPTY_GROUP_ALERT + dishGroup.group + ". Вы можете добавить рецепты в <a href=\"/dashboard.html\">панели управления</a></span>");
		}
		else {
			for (let i = 0; i < dishGroup.recipes.length; i++) {
				const recipe = dishGroup.recipes[i];
				appendRecipePreview(recipe);
			}
		}
	};

	getContent(callback, currentDishGroup);
}

// TODO: move to recipe block
function appendRecipe(recipe) {
	let img = "";
	if (recipe.image_hash) {
		img = "<obj class=\"recipe__image\"	type=\"image/png\">" +
			"<img src=\"" + jsonPath + "/api/image/" + recipe.image_hash + "\"/></obj>";
	}
	$("<div class=\"recipe\"></div>")
		.insertAfter($(".recipe-preview")[0])
		.append(
			"<div class=\"recipe__title\">"	+ recipe.title + "</div>" +
			img +
			"<div class=\"recipe__ingredients-title\">" + INGREDIENTS_TITLE + "</div>"	+
			"<ul class=\"recipe__ingredients\"></ul>" +
			"<div class=\"recipe__steps\">" +
			"<div class=\"recipe__steps-title\">" + STEPS_TITLE + "</div>"
		);

	const components = recipe.components;
	for (let i = 0; i < components.length; i++) {
		$(".recipe__ingredients").append("<li class=\"recipe__ingredient\">" + components[i] + "</li>");
	}

	const steps = recipe.steps;
	for (let i = 0; i < steps.length; i++) {
		$(".recipe__steps").append("<p class=\"recipe__step\">" + steps[i] + "</p");
	}
}

// TODO: move to breadcrumb block
function appendRecipeToBreadcrumb(title) {
	$(".all-recipes__breadcrumb")
		.append("<div class=\"breadcrumb__arrow\"/><div class=\"breadcrumb__current-recipe\">" + title + "</div>");
}


function openRecipe() {
	$(".recipe-preview").hide();
	const recipeId = $(this).find(".recipe-preview__id").text();
	const recipeTitle = $(this).find(".recipe-preview__title").text();

	const callback = function (recipe) {
		if (recipe !== null) {
			appendRecipeToBreadcrumb(recipeTitle);
			appendRecipe(recipe);
		}
	};

	getContent(callback, null, recipeId);
}


$(document).ready(function (){
	$(document).on("click", ".dish-group", openDishGroup);
	$(document).on("click", ".recipe-preview", openRecipe);

});
