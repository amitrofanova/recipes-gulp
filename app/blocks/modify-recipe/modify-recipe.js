import $ from "jquery";
import {CONFIRM_MODIFY_ALERT, MODIFIED_RECIPE_ALERT, ERROR_ALERT, EMPTY_INGREDIENT_ALERT}from "../../resources/strings/ru.js";
import {showAlert, hideAlert}from "../modal-alert/modal-alert.js";
import {authHeader}from "../auth-form/auth-form.js";
import {createEditor, destroyEditor, resizeImage}from "../photo-editor/photo-editor.js";
import {createLoader, destroyLoader}from "../loader/loader.js";

const pathToJson = "https://amitrofanova.pythonanywhere.com/api/";
const pathToRecipes = "https://amitrofanova.pythonanywhere.com/api/recipes/";
const pathToGroups = "https://amitrofanova.pythonanywhere.com/api/groups/";

const CLASS_PREFIX = ".modify-recipe";
const groupsSelect = CLASS_PREFIX + "__dish-group", // eslint-disable-line one-var
	recipesSelect = CLASS_PREFIX + "__recipe-to-modify",
	modifyBtn = CLASS_PREFIX + "__modify-btn",
	submitBtn = CLASS_PREFIX + "__submit-btn",
	confirmBtn = ".modal-alert__confirm-btn",
	declineBtn = ".modal-alert__decline-btn",
	refreshBtn = CLASS_PREFIX + "__refresh-btn",
	newItem = CLASS_PREFIX + "__new-item";

// https://www.w3schools.com/jsref/prop_node_nodetype.asp
const TEXT_NODE_TYPE = 3;


function getList(callback, group) {
	let url = pathToGroups + "?short";

	if (group) {
		url = pathToGroups + encodeURIComponent(group) + "?short";
	}

	$.ajax({
		url,
		headers: {
			Authorization: authHeader()
		},
		dataType: "json",
		success(data){
			callback(data);
		}
	});
}


function clearRecipesSelect() {
	$(recipesSelect).text("");
}


function createRecipesSelect() {
	clearRecipesSelect();

	const group = $(groupsSelect).val();

	const callback = function (data) {
		for (let i = 0; i < data.recipes.length; i++) {
			$(recipesSelect).append(
				"<option value='" + data.recipes[i] + "'>" + data.recipes[i] + "</option>"
			);
		}
	};

	getList(callback, group);
}


function createGroupsSelect() {
	const callback = function (data) {

		if (!data.length){return;}

		for (let i = 0; i < data.length; i++) {
			$(groupsSelect).append(
				"<option value=\"" + data[i].group + "\">" + data[i].group + "</option>"
			);
		}
		$(groupsSelect).val(data[0].group);
		createRecipesSelect();
	};

	getList(callback);
}


function getIngredients() {
	const ingredients = [];
	let newIngredient;

	$(newItem).each(function () {
		if ($(this).parents(".modify-recipe__ingredients").length) {

			newIngredient = $(this).contents().filter(function () {
				return this.nodeType === TEXT_NODE_TYPE;
			}).text();
			ingredients.push(newIngredient);
		}
	});
	return ingredients;
}


function getSteps() {
	const steps = [];
	let newStep;

	$(newItem).each(function () {
		if ($(this).parents(".modify-recipe__steps").length) {

			newStep = $(this).contents().filter(function () {
				return this.nodeType === TEXT_NODE_TYPE;
			}).text();

			steps.push(newStep);
		}
	});

	return steps;
}


function appendIngredient(ingredient) {
	const newEl = "<div class=\"modify-recipe__new-item\">" + ingredient + "<div class=\"modify-recipe__delete-item\"></div></div>";
	$(".modify-recipe__ingredients").append(newEl);
}


function appendStep(step) {
	const newEl = "<div class=\"modify-recipe__new-item\">" + step + "<div class=\"modify-recipe__delete-item\"></div></div>";
	$(".modify-recipe__steps").append(newEl);
}


function getCurrentData(recipeToModify) {
	const result = null;
	const url = pathToRecipes + encodeURIComponent(recipeToModify);
	const imgSrc = pathToJson + "image/";
	const imgMinSrc = pathToJson + "image/";

	const callback = function (recipe) {

		$(".modify-recipe__title-input").val(recipe.title);
		$(".modify-recipe__description-input").val(recipe.description);
		$(".modify-recipe__image-preview").attr("src", imgSrc + recipe.image_hash);
		$(".modify-recipe__image-preview-min").attr("src", imgMinSrc + recipe.image_min_hash);

		for (let i = 0; i < recipe.components.length; i++) {
			const ingredient = recipe.components[i];
			appendIngredient(ingredient);
		}

		for (let i = 0; i < recipe.steps.length; i++) {
			const step = recipe.steps[i];
			appendStep(step);
		}

	};

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


function addIngredient() {
	const ingredient = $(".modify-recipe__ingredient-input").val();

	if ((ingredient !== "") && (ingredient !== EMPTY_INGREDIENT_ALERT)) {
		appendIngredient(ingredient);
	}

	else {
		$(".modify-recipe__ingredient-input").val(EMPTY_INGREDIENT_ALERT);
		$(".modify-recipe__ingredient-input").css("color", "#fff");
	}
}


function addStep() {
	const step = $(".modify-recipe__step-input").val();

	if (step !== "") {
		appendStep(step);
	}
}


function deleteItem() {
	const ingredients = getIngredients();
	const steps = getSteps();
	let itemToDelete;

	// Define if current section related to ingredients or steps
	if ($(this).parents(".modify-recipe__ingredients").length) {

		itemToDelete = ingredients
			.indexOf($(this)
				.parent()
				.contents().not($(newItem).children())
				.text()
			);

		ingredients.splice(itemToDelete, 1);
	}

	else if ($(this).parents(".modify-recipe__steps").length) {

		itemToDelete = steps
			.indexOf($(this)
				.parent()
				.contents().not($(newItem).children())
				.text()
			);

		steps.splice(itemToDelete, 1);
	}

	// Delete element from DOM
	$(this).parent().remove();
}


function getNewData() {
	const title = $(".modify-recipe__title-input").val();
	const description = $(".modify-recipe__description-input").val();
	const image_min = $(".modify-recipe__image-preview-min").attr("src");
	const image = $(".modify-recipe__image-preview").attr("src");
	const newRecipe = {
		title,
		description,
		image_min,
		image,
		components: getIngredients(),
		steps: getSteps()
	};
	const newRecipeToJSON = JSON.stringify(newRecipe, null, "\t");
	return newRecipeToJSON;
}


function resetForm() {
	$(".modify-recipe")[0].reset();
	$(".modify-recipe__new-item").remove();
	$(".modify-recipe__delete-item").remove();
	$(".modify-recipe__image-preview").attr("src", "");
	$(".modify-recipe__image-preview-min").attr("src", "");
}


function saveRecipe() {
	const group = $(".modify-recipe__dish-group").val();
	const url = pathToRecipes + "?group=" + encodeURIComponent(group);

	$.ajax({
		type: "POST",
		url,
		headers: {
			Authorization: authHeader()
		},
		dataType: "json",
		data: getNewData(),
		success(){
			showAlert(MODIFIED_RECIPE_ALERT);
			resetForm();
		},
		error(xhr) {
			const err = ERROR_ALERT + xhr.responseText;
			// showAlert(err);
			console.log(err);
		},
		beforeSend() {
			createLoader();
		},
		complete() {
			destroyLoader();
		}
	});
}


function deleteRecipe() {
	const group = $(".modify-recipe__dish-group").val();
	const recipeToDelete = $(".modify-recipe__recipe-to-modify").val();
	const url = pathToRecipes + encodeURIComponent(recipeToDelete) + "?group=" + encodeURIComponent(group);

	$.ajax({
		type: "DELETE",
		url,
		headers: {
			Authorization: authHeader()
		},
		dataType: "json",
		success(){
			saveRecipe();
		},
		error(xhr) {
			const err = ERROR_ALERT + xhr.responseText;
			// showAlert(err);
			console.log(err);
		}
	});
}


function getCroppedImg() {
	const img = $(".photo-editor__image-crop").attr("src");
	// const imgMin = $(".photo-editor__image-crop-min").attr("src");

	const imageToResize = $(".photo-editor__image-crop-min")[0];
	// console.log("initial: " + imgMin.length);
	const resizedImgMin = resizeImage(imageToResize);
	// console.log("resized: " + resizedImgMin.length);

	$(".modify-recipe__image-preview").attr("src", img);
	$(".modify-recipe__image-preview-min").attr("src", resizedImgMin);
	destroyEditor();
}


$(document).ready(function (){

	if (window.location.pathname === "/dashboard.html") {
		window.onload = createGroupsSelect();
	}

	$(document).on("change", groupsSelect, createRecipesSelect);
	$(document).on("click", refreshBtn, createRecipesSelect);

	$(document).on("click", modifyBtn, function () {
		const recipeToModify = $(recipesSelect).val();
		getCurrentData(recipeToModify);
	});

	$(document).on("click", ".modify-recipe__open-editor-btn", createEditor);
	$(document).on("click", ".photo-editor__submit-btn", function () {
		if ($(this).parents(".modify-recipe").length) {
			getCroppedImg();
		}
	});

	$(document).on("click", ".modify-recipe__new-ingredient-btn", addIngredient);
	$(document).on("click", ".modify-recipe__new-step-btn", addStep);
	$(document).on("click", ".modify-recipe__delete-item", deleteItem);

	$(document).on("click", submitBtn, function () {
		showAlert(CONFIRM_MODIFY_ALERT, true);

		$(document).on("click", confirmBtn, function () {
			hideAlert();
			deleteRecipe();
		});

		$(document).on("click", declineBtn, hideAlert);
	});

});
